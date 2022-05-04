import io from 'socket.io-client';
import getConfig from 'next/config';
import { Store, AnyAction } from 'redux';
import { message as msg } from 'antd';

import { ChatMessage, AppStore } from '@Interfaces';
import { ChatroomActions } from '@Actions';

const {
  publicRuntimeConfig: { API_URL },
} = getConfig();

type ConnectionResponse = {
  messages: ChatMessage[];
};

export const getChatroomId = (type: 'client' | 'newsroom', ids: number | number[]) =>
  type === 'client'
    ? `chat-clients:${(ids as number[]).sort().join('-')}`
    : `chat-newsroom:${ids as number}`;

export class ChatroomSocket {
  private socket: SocketIOClient.Socket;

  private store: AppStore;

  public id: string;

  public type: 'client' | 'newsroom';

  public ids: number | number[];

  constructor(type: 'client' | 'newsroom', ids: number | number[], store: Store<any, AnyAction>) {
    this.store = store;
    this.id = getChatroomId(type, ids);
    this.type = type;
    this.ids = ids;
    const url = new URL(API_URL);
    const path = url.pathname.length > 1 ? `${url.pathname}/socket.io` : '/socket.io';
    this.socket = io(`${API_URL}/chatroom`, {
      path,
      withCredentials: true,
    } as any);

    this.joinChatroom();
  }

  async emit<T = void>(event: string, ...inputs: any[]) {
    return new Promise<T>((resolve, reject) => {
      this.socket.emit(event, ...inputs, this.getCallback(resolve, reject));
    });
  }

  private errorHandler = (err: string) => {
    if (err) {
      msg.error(err);
    }
    return err;
  };

  private getCallback = (resolve: Function, reject: Function) => {
    return (...inputs: any[]) => {
      if (inputs[0]) return reject(this.errorHandler(inputs[0]));
      return resolve(...inputs.slice(1));
    };
  };

  async joinChatroom() {
    const response = await this.emit<ConnectionResponse>('join chatroom', this.type, this.ids);

    this.store.dispatch(ChatroomActions.AddNewsroom(this.id, this.type, this.ids));

    for (let i = 0; i < response.messages.length; i += 1) {
      this.store.dispatch(ChatroomActions.AddMessage(this.id, response.messages[i]));
    }

    const connectTimeout = 0;
    const connectAttemptResponse = () => {};
    this.socket.on('reconnect_attempt', connectAttemptResponse);
    this.socket.on('reconnecting', connectAttemptResponse);

    const connectSucceededResponse = () => {
      clearTimeout(connectTimeout);
    };
    this.socket.on('pong', connectSucceededResponse);
    this.socket.on('connect', connectSucceededResponse);
    this.socket.on('reconnect', connectSucceededResponse);

    const connectFailedResponse = () => {
      console.log('sad');
    };

    this.socket.on('connect_failed', connectFailedResponse);
    this.socket.on('reconnect_failed', connectFailedResponse);
    this.socket.on('reconnect_error', connectFailedResponse);

    this.socket.on('send message', (message: ChatMessage) => {
      this.store.dispatch(ChatroomActions.AddMessage(message.chatId, message));
    });
  }

  async sendMessage(message: string) {
    await this.emit('send message', this.type, this.ids, message);
  }

  async leaveChatroom() {
    return this.emit('leave chatroom', this.type, this.ids);
  }

  destroy() {
    this.leaveChatroom();
    this.socket.disconnect();
  }
}

let chatroomSocketMap: { [index: string]: ChatroomSocket } = {};

export function getChatroomSocket(
  type: 'client' | 'newsroom',
  ids: number | number[]
): ChatroomSocket | null;
export function getChatroomSocket(
  type: 'client' | 'newsroom',
  ids: number | number[],
  store: Store<any, AnyAction>
): ChatroomSocket;
export function getChatroomSocket(
  type: 'client' | 'newsroom',
  ids: number | number[],
  store?: Store<any, AnyAction>
): ChatroomSocket | null {
  if (typeof window === 'undefined') return null;
  const id = getChatroomId(type, ids);
  if (typeof chatroomSocketMap[id] !== 'undefined') {
    return chatroomSocketMap[id];
  }
  if (!store) return null;
  chatroomSocketMap[id] = new ChatroomSocket(type, ids, store);
  return chatroomSocketMap[id];
}

export function closeChatroomSocket(type: 'client' | 'newsroom', ids: number | number[]) {
  if (typeof window === 'undefined') return;
  const id = getChatroomId(type, ids);
  if (typeof chatroomSocketMap[id] === 'undefined') return;
  chatroomSocketMap[id].destroy();
  delete chatroomSocketMap[id];
}

export function clearChatroomSockets() {
  const keys = Object.keys(chatroomSocketMap);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    chatroomSocketMap[+key].destroy();
  }
  chatroomSocketMap = {};
}
