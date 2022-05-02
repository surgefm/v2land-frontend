import io from 'socket.io-client';
import getConfig from 'next/config';
import { Store, AnyAction } from 'redux';
import { message } from 'antd';

import {
  EventStackNews,
  Commit,
  News,
  Stack,
  Event,
  HeaderImage,
  NewsroomRoles,
  AppStore,
} from '@Interfaces';
import { EventActions, StackActions, NewsroomActions, TagActions } from '@Actions';
import { getNewsroom, isNewsroomSocketConnected, getEvent } from '@Selectors';

const {
  publicRuntimeConfig: { API_URL },
} = getConfig();

type ResourceLock = {
  model: string;
  resourceId: number;
  locker?: number;
};

type ConnectionResponse = {
  resourceLocks: ResourceLock[];
  clients: number[];
  roles: NewsroomRoles;
};

type StackOrderData = {
  stackId: number;
  order: number;
};

type Response = {
  eventStackNews?: EventStackNews;
  news?: News;
  stack?: Stack;
  stackId?: number;
  event?: Event;
  eventId?: number;
  clientId?: number;
  tagId?: number;
  stacks?: StackOrderData[];
  headerImage?: HeaderImage;
  model?: string;
  resourceId: number;
  locker?: number;
  resourceLocks?: ResourceLock[];
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

  private unlockResources = (eventId: number, resourceLocks: ResourceLock[]) => {
    for (let i = 0; i < resourceLocks.length; i += 1) {
      const resourceLock = resourceLocks[i];
      this.store.dispatch(
        NewsroomActions.UnlockResource(eventId, resourceLock.model, resourceLock.resourceId)
      );
    }
  };

  constructor(eventId: number, store: Store<any, AnyAction>) {
    this.store = store;
    this.eventId = Math.abs(eventId);
    const url = new URL(API_URL);
    const path = url.pathname.length > 1 ? `${url.pathname}/socket.io` : '/socket.io';
    this.socket = io(`${API_URL}/newsroom`, {
      path,
      withCredentials: true,
    } as any);

    this.joinNewsroom();
  }

  async emit<T = void>(event: string, ...inputs: any[]) {
    return new Promise<T>((resolve, reject) => {
      this.socket.emit(event, ...inputs, this.getCallback(resolve, reject));
    });
  }

  async joinNewsroom() {
    const response = await this.emit<ConnectionResponse>('join newsroom', this.eventId);
    const locks: { [index: string]: number } = {};
    for (let i = 0; i < response.resourceLocks.length; i += 1) {
      const lock = response.resourceLocks[i];
      locks[`${lock.model}-${lock.resourceId}`] = lock.locker || -1;
    }

    this.store.dispatch(
      NewsroomActions.AddNewsroom({
        eventId: this.eventId,
        clients: response.clients,
        roles: response.roles,
        resourceLocks: locks,
        socketStatus: 'connected',
      })
    );

    let connectTimeout = 0;
    const connectAttemptResponse = () => {
      connectTimeout = setTimeout(() => {
        const newsroom = getNewsroom(this.eventId)(this.store.getState());
        if (!newsroom || newsroom.socketStatus === 'connecting') return;
        this.store.dispatch(NewsroomActions.SetNewsroomSocketStatus(this.eventId, 'connecting'));
      }, 2000);
    };
    this.socket.on('reconnect_attempt', connectAttemptResponse);
    this.socket.on('reconnecting', connectAttemptResponse);

    const connectSucceededResponse = () => {
      clearTimeout(connectTimeout);
      if (isNewsroomSocketConnected(this.eventId)(this.store.getState())) return;
      this.store.dispatch(NewsroomActions.SetNewsroomSocketStatus(this.eventId, 'connected'));
    };
    this.socket.on('pong', connectSucceededResponse);
    this.socket.on('connect', connectSucceededResponse);
    this.socket.on('reconnect', connectSucceededResponse);

    const connectFailedResponse = () => {
      clearTimeout(connectTimeout);
      const newsroom = getNewsroom(this.eventId)(this.store.getState());
      if (!newsroom || newsroom.socketStatus === 'disconnected') return;
      this.store.dispatch(NewsroomActions.SetNewsroomSocketStatus(this.eventId, 'disconnected'));
    };

    this.socket.on('connect_failed', connectFailedResponse);
    this.socket.on('reconnect_failed', connectFailedResponse);
    this.socket.on('reconnect_error', connectFailedResponse);

    this.socket.on('reconnect_failed', () => {
      message.error('无法连接到服务器');
      this.store.dispatch(NewsroomActions.SetNewsroomSocketStatus(this.eventId, 'disconnected'));
    });

    this.socket.on('join newsroom', (res: Response) => {
      const clientId = res.clientId as number;
      this.store.dispatch(NewsroomActions.AddNewsroomClient(this.eventId, clientId));
    });

    this.socket.on('leave newsroom', (res: Response) => {
      const clientId = res.clientId as number;
      this.store.dispatch(NewsroomActions.RemoveNewsroomClient(this.eventId, clientId));
    });

    this.socket.on('add event to stack', (res: Response) => {
      const { stackId, eventId } = res;
      if (!stackId || !eventId) return;
      if (!getEvent(eventId)(this.store.getState())) {
        this.store.dispatch(EventActions.GetEvent(eventId));
      }

      this.store.dispatch(StackActions.AddEventToStack(stackId, eventId));
    });

    this.socket.on('add news to event', (res: Response) => {
      const esn = res.eventStackNews as EventStackNews;
      this.store.dispatch(EventActions.AddNewsToEvent(-esn.eventId, -(esn.newsId as number)));
    });

    this.socket.on('add news to stack', (res: Response) => {
      const esn = res.eventStackNews as EventStackNews;
      this.store.dispatch(
        StackActions.AddNewsToStack(-(esn.stackId as number), -(esn.newsId as number))
      );
    });

    this.socket.on('create stack', (res: Response) => {
      const stack = res.stack as Stack;
      stack.id = -Math.abs(stack.id);
      this.store.dispatch(StackActions.AddStack(stack));
      this.store.dispatch(
        EventActions.AddStackToEventOffshelfStackList(-(stack.eventId || 0), stack.id)
      );
    });

    this.socket.on('remove event from stack', (res: Response) => {
      const stackId = res.stackId as number;
      this.store.dispatch(StackActions.RemoveEventFromStack(-stackId));
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

    this.socket.on('update header image', (res: Response) => {
      const eventId = res.eventId as number;
      const headerImage = res.headerImage as HeaderImage;
      this.store.dispatch(EventActions.UpdateEvent(-eventId, { headerImage } as Event));
    });

    this.socket.on('update stack', (res: Response) => {
      const stack = res.stack as Stack;
      stack.id = -stack.id;
      this.store.dispatch(StackActions.UpdateStack(stack.id, stack));
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
        .sort((a, b) => (b.order || 0) - (a.order || 0))
        .map(stack => -stack.stackId);
      const updateData = {} as Event;
      if (offshelfStackIdList.length > 0) updateData.offshelfStackIdList = offshelfStackIdList;
      if (stackIdList.length > 0) updateData.stackIdList = stackIdList;
      this.store.dispatch(EventActions.UpdateEvent(eventId, updateData));
    });

    this.socket.on('add event to tag', (res: Response) => {
      const tagId = res.tagId as number;
      const eventId = res.eventId as number;
      this.store.dispatch(TagActions.AddEventToTag(tagId, eventId));
    });

    this.socket.on('remove event from tag', (res: Response) => {
      const tagId = res.tagId as number;
      const eventId = res.eventId as number;
      this.store.dispatch(TagActions.RemoveEventFromTag(tagId, eventId));
    });

    this.socket.on('lock resource', (res: Response) => {
      const eventId = res.eventId as number;
      const model = res.model as string;
      const resourceId = res.resourceId as number;
      const locker = res.locker as number;
      this.store.dispatch(NewsroomActions.LockResource(eventId, model, resourceId, locker));
    });

    this.socket.on('unlock resource', (res: Response) => {
      const eventId = res.eventId as number;
      const model = res.model as string;
      const resourceId = res.resourceId as number;
      this.store.dispatch(NewsroomActions.UnlockResource(eventId, model, resourceId));
    });

    this.socket.on('unlock resources', (res: Response) => {
      const eventId = res.eventId as number;
      const { resourceLocks } = res;
      this.unlockResources(eventId, resourceLocks || []);
    });

    const onRoleChange = (role: string, isAdding = true) => (res: Response) => {
      const eventId = res.eventId as number;
      const clientId = res.clientId as number;
      this.store.dispatch(
        NewsroomActions.SetNewsroomClientRole(eventId, clientId, isAdding ? role : undefined)
      );
    };

    this.socket.on('add viewer', onRoleChange('viewer'));
    this.socket.on('add editor', onRoleChange('editor'));
    this.socket.on('add manager', onRoleChange('manager'));
    this.socket.on('remove viewer', onRoleChange('viewer', false));
    this.socket.on('remove editor', onRoleChange('editor', false));
    this.socket.on('remove manager', onRoleChange('manager', false));
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

  async leaveNewsroom() {
    return this.emit('leave newsroom', this.eventId);
  }

  async makeCommit(summary: string, description: string) {
    return this.emit<{ commit: Commit }>('make commit', this.eventId, summary, description);
  }

  async removeEventFromStack(stackId: number) {
    return this.emit('remove event from stack', Math.abs(stackId));
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

  async updateHeaderImage(headerImage: HeaderImage) {
    const response = await this.emit<{ headerImage: HeaderImage }>(
      'update header image',
      this.eventId,
      headerImage
    );

    this.store.dispatch(EventActions.UpdateEvent(-this.eventId, response as Event));
    return response.headerImage;
  }

  async updateStack(stack: Stack) {
    await this.emit('update stack', Math.abs(stack.id), stack);
    this.store.dispatch(StackActions.UpdateStack(-Math.abs(stack.id), stack));
  }

  async updateStackOrders(stacks: { stackId: number; order: number }[]) {
    return this.emit('update stack orders', this.eventId, stacks);
  }

  async addEventToTag(tagId: number) {
    return this.emit('add event to tag', this.eventId, tagId);
  }

  async removeEventFromTag(tagId: number) {
    return this.emit('remove event from tag', this.eventId, tagId);
  }

  async lockResource(model: string, resourceId: number) {
    return this.emit('lock resource', this.eventId, model, Math.abs(resourceId));
  }

  async lockStack(stackId: number) {
    return this.lockResource('stack', stackId);
  }

  async unlockResource(model: string, resourceId: number) {
    return this.emit('unlock resource', this.eventId, model, Math.abs(resourceId));
  }

  async unlockStack(stackId: number) {
    return this.unlockResource('stack', stackId);
  }

  async changeRole(clientId: number, role: string, isInviting = true) {
    const response = await this.emit<Response>(
      `${isInviting ? 'invite' : 'remove'} ${role}`,
      this.eventId,
      clientId
    );
    if (response && response.resourceLocks) {
      this.unlockResources(this.eventId, response.resourceLocks || []);
    }
    this.store.dispatch(
      NewsroomActions.SetNewsroomClientRole(this.eventId, clientId, isInviting ? role : undefined)
    );
  }

  async inviteViewer(clientId: number) {
    return this.changeRole(clientId, 'viewer');
  }

  async inviteEditor(clientId: number) {
    return this.changeRole(clientId, 'editor');
  }

  async inviteManager(clientId: number) {
    return this.changeRole(clientId, 'manager');
  }

  async removeViewer(clientId: number) {
    return this.changeRole(clientId, 'viewer', false);
  }

  async removeEditor(clientId: number) {
    return this.changeRole(clientId, 'editor', false);
  }

  async removeManager(clientId: number) {
    return this.changeRole(clientId, 'manager', false);
  }

  destroy() {
    this.leaveNewsroom();
    this.socket.disconnect();
  }
}

let newsroomSocketMap: { [index: number]: NewsroomSocket } = {};
export function getNewsroomSocket(
  eventId: number,
  store?: Store<any, AnyAction>
): NewsroomSocket | null {
  if (typeof window === 'undefined') return null;
  const id = Math.abs(eventId);
  if (typeof newsroomSocketMap[id] !== 'undefined') {
    return newsroomSocketMap[id];
  }
  if (!store) return null;
  newsroomSocketMap[id] = new NewsroomSocket(id, store);
  return newsroomSocketMap[id];
}

export function closeNewsroomSocket(eventId: number) {
  if (typeof window === 'undefined') return;
  const id = Math.abs(eventId);
  if (typeof newsroomSocketMap[id] === 'undefined') return;
  newsroomSocketMap[id].destroy();
  delete newsroomSocketMap[id];
}

export function clearNewsroomSockets() {
  const keys = Object.keys(newsroomSocketMap);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    newsroomSocketMap[+key].destroy();
  }
  newsroomSocketMap = {};
}
