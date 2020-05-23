import io from 'socket.io-client';
import getConfig from 'next/config';
import { Store, AnyAction } from 'redux';
import { message } from 'antd';

import { EventStackNews, Commit, News, Stack, Event, AppStore } from '@Interfaces';
import { EventActions, StackActions } from '@Actions';

const {
  publicRuntimeConfig: { API_URL },
} = getConfig();

type StackOrderData = {
  stackId: number;
  order: number;
};

type Response = {
  eventStackNews: EventStackNews;
  news?: News;
  stack?: Stack;
  event?: Event;
  eventId?: number;
  stacks?: StackOrderData[];
};

export class NewsroomSocket {
  private socket: SocketIOClient.Socket;

  private store: AppStore;

  private eventId: number;

  private errorHandler = (err: string) => {
    if (err) {
      message.error(err);
      this.store.dispatch(EventActions.GetEvent(this.eventId, true));
    }
    return err;
  };

  private getCallback = (resolve: Function, reject: Function) => {
    return (...inputs: any[]) => {
      if (inputs[0]) return reject(this.errorHandler(inputs[0]));
      return resolve(...inputs.slice(1));
    };
  };

  constructor(eventId: number, store: Store<any, AnyAction>) {
    this.store = store;
    this.eventId = Math.abs(eventId);
    this.socket = io(`${API_URL}/newsroom`);
    this.joinNewsroom();
  }

  async emit<T = void>(event: string, ...inputs: any[]) {
    return new Promise<T>((resolve, reject) => {
      this.socket.emit(event, ...inputs, this.getCallback(resolve, reject));
    });
  }

  async joinNewsroom() {
    await this.emit('join newsroom', this.eventId);

    this.socket.on('add news to event', (res: Response) => {
      const esn = res.eventStackNews;
      this.store.dispatch(EventActions.AddNewsToEvent(-esn.eventId, -(esn.newsId as number)));
    });

    this.socket.on('add news to stack', (res: Response) => {
      const esn = res.eventStackNews;
      this.store.dispatch(
        StackActions.AddNewsToStack(-(esn.stackId as number), -(esn.newsId as number))
      );
    });

    this.socket.on('remove news from stack', (esn: EventStackNews) => {
      this.store.dispatch(
        StackActions.RemoveNewsFromStack(-(esn.stackId as number), -(esn.newsId as number))
      );
    });

    this.socket.on('remove news from event', (esn: EventStackNews) => {
      this.store.dispatch(EventActions.RemoveNewsFromEvent(-esn.eventId, -(esn.newsId as number)));
    });

    this.socket.on('update event information', (res: Response) => {
      const event = res.event as Event;
      event.id = -event.id;
      this.store.dispatch(EventActions.UpdateEvent(event.id, event));
    });

    this.socket.on('update stack orders', (res: Response) => {
      const eventId = -(res.eventId as number);
      const stacks = res.stacks as StackOrderData[];
      const offshelfStackIdList = stacks
        .filter(stack => stack.order < 0)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(stack => -stack.stackId);
      const stackIdList = stacks
        .filter(stack => stack.order >= 0)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(stack => -stack.stackId);
      const updateData = {} as Event;
      if (offshelfStackIdList.length > 0) updateData.offshelfStackIdList = offshelfStackIdList;
      if (stackIdList.length > 0) updateData.stackIdList = stackIdList;
      this.store.dispatch(EventActions.UpdateEvent(eventId, updateData));
    });
  }

  async addNewsToEvent(newsId: number) {
    return this.emit('add news to event', Math.abs(newsId), this.eventId);
  }

  async addNewsToStack(newsId: number, stackId: number) {
    return this.emit('add news to stack', Math.abs(newsId), Math.abs(stackId));
  }

  async createStack(stack: Stack) {
    return this.emit<{ stack: Stack }>('create stack', this.eventId, stack);
  }

  async makeCommit(summary: string, description: string) {
    return this.emit<{ commit: Commit }>('make commit', this.eventId, summary, description);
  }

  async removeNewsFromEvent(newsId: number, eventId: number) {
    return this.emit('remove news from event', Math.abs(newsId), Math.abs(eventId));
  }

  async removeNewsFromStack(newsId: number, stackId: number) {
    return this.emit('remove news from stack', Math.abs(newsId), Math.abs(stackId));
  }

  async updateEvent(event: Event) {
    await this.emit('update event information', this.eventId, event);
    this.store.dispatch(EventActions.UpdateEvent(-this.eventId, event));
  }

  async updateStackOrders(stacks: { stackId: number; order: number }[]) {
    return this.emit('update stack orders', this.eventId, stacks);
  }

  destroy() {
    this.socket.disconnect();
  }
}

let newsroomSocketMap: { [index: number]: NewsroomSocket } = {};
export const getNewsroomSocket = (
  eventId: number,
  store: Store<any, AnyAction>
): NewsroomSocket | null => {
  if (typeof window === 'undefined') return null;
  const id = Math.abs(eventId);
  if (typeof newsroomSocketMap[id] !== 'undefined') {
    return newsroomSocketMap[id];
  }
  newsroomSocketMap[id] = new NewsroomSocket(id, store);
  return newsroomSocketMap[id];
};

export const clearNewsroomSockets = () => {
  const keys = Object.keys(newsroomSocketMap);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    newsroomSocketMap[+key].destroy();
  }
  newsroomSocketMap = {};
};
