import io from 'socket.io-client';
import getConfig from 'next/config';
import { Store, AnyAction } from 'redux';
import { message } from 'antd';

import { EventStackNews, News, Stack, Event, AppStore } from '@Interfaces';
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

  private callback = (err: string) => {
    if (err) {
      message.error(err);
      this.store.dispatch(EventActions.GetEvent(this.eventId, true));
    }
  };

  constructor(eventId: number, store: Store<any, AnyAction>) {
    this.store = store;
    this.eventId = eventId;
    this.socket = io(`${API_URL}/newsroom`);
    this.joinNewsroom();
  }

  joinNewsroom() {
    this.socket.emit('join newsroom', this.eventId, this.callback);

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

    this.socket.on('update stack orders', (res: Response) => {
      const eventId = res.eventId as number;
      const stackIdList = res.stackIdList as number[];
      this.store.dispatch(EventActions.UpdateEvent(eventId, { stackIdList } as Event));
    });
  }

  addNewsToEvent(newsId: number) {
    this.socket.emit('add news to event', newsId, this.eventId, this.callback);
  }

  addNewsToStack(newsId: number, stackId: number) {
    this.socket.emit('add news to stack', newsId, stackId, this.callback);
  }

  removeNewsFromEvent(newsId: number, eventId: number) {
    this.socket.emit('remove news from event', newsId, eventId, this.callback);
  }

  removeNewsFromStack(newsId: number, stackId: number) {
    this.socket.emit('remove news from stack', newsId, stackId, this.callback);
  }

  updateStackOrders(stackIdList: number[]) {
    this.socket.emit('update stack orders', this.eventId, stackIdList, this.callback);
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