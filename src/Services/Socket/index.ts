import io from 'socket.io-client';
import getConfig from 'next/config';
import { Store, AnyAction } from 'redux';
import { message } from 'antd';

import { EventStackNews, Commit, News, Stack, Event, AppStore } from '@Interfaces';
import { EventActions, StackActions } from '@Actions';

const {
  publicRuntimeConfig: { API_URL },
} = getConfig();

type Response = {
  eventStackNews: EventStackNews;
  news?: News;
  stack?: Stack;
  event?: Event;
  eventId?: number;
  stackIdList?: number[];
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
    this.eventId = eventId;
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
      this.store.dispatch(
        EventActions.AddNewsToEvent(esn.eventId, esn.newsId as number, esn.isInTemporaryStack)
      );
    });

    this.socket.on('add news to stack', (res: Response) => {
      const esn = res.eventStackNews;
      this.store.dispatch(StackActions.AddNewsToStack(esn.stackId as number, esn.newsId as number));
    });

    // this.socket.on('remove news from stack', (esn: EventStackNews) => {
    //   this.store.dispatch(StackActions.)
    // })

    this.socket.on('update event information', (res: Response) => {
      const event = res.event as Event;
      this.store.dispatch(EventActions.UpdateEvent(event.id, event));
    });

    this.socket.on('update stack orders', (res: Response) => {
      const eventId = res.eventId as number;
      const stackIdList = res.stackIdList as number[];
      this.store.dispatch(EventActions.UpdateEvent(eventId, { stackIdList } as Event));
    });
  }

  async addNewsToEvent(newsId: number) {
    return this.emit('add news to event', newsId, this.eventId);
  }

  async addNewsToStack(newsId: number, stackId: number) {
    return this.emit('add news to stack', newsId, stackId);
  }

  async makeCommit(summary: string, description: string) {
    return this.emit<{ commit: Commit }>('make commit', this.eventId, summary, description);
  }

  async removeNewsFromEvent(newsId: number, eventId: number) {
    return this.emit('remove news from event', newsId, eventId);
  }

  async removeNewsFromStack(newsId: number, stackId: number) {
    return this.emit('remove news from stack', newsId, stackId);
  }

  async updateEvent(event: Event) {
    return this.emit('update event information', this.eventId, event);
  }

  async updateStackOrders(stackIdList: number[]) {
    return this.emit('update stack orders', this.eventId, stackIdList);
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
  if (typeof newsroomSocketMap[eventId] !== 'undefined') {
    return newsroomSocketMap[eventId];
  }
  newsroomSocketMap[eventId] = new NewsroomSocket(eventId, store);
  return newsroomSocketMap[eventId];
};

export const clearNewsroomSockets = () => {
  const keys = Object.keys(newsroomSocketMap);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    newsroomSocketMap[+key].destroy();
  }
  newsroomSocketMap = {};
};
