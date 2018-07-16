export default {
  isClientAdmin(state) {
    return state.client.role === 'admin';
  },

  isClientManager(state) {
    return ['admin', 'manager'].includes(state.client.role);
  },

  isLoggedIn(state) {
    return !!state.client.id;
  },

  isServer() {
    return typeof document === 'undefined';
  },

  isFirstPage(state) {
    return state.redirectCount <= 1;
  },

  getClient(state) {
    return state.client;
  },

  findClient: (state) => (id) => {
    for (const client of state.clientList) {
      if (client.id === id || client.username === id) {
        return client;
      }
    }

    return null;
  },

  clientList(state) {
    return state.clientList;
  },

  getEvent: (state) => (name) => {
    if (!name) return null;

    if (state.event[name]) return state.event[name];
    if (state.eventName[name]) return state.event[state.eventName[name]];

    return null;
  },

  getEventList: (state) => (
    filter = () => true,
    sort = (a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  ) => {
    const eventList = [];
    for (const id of state.eventId) {
      eventList.push(state.event[id]);
    }
    return eventList.filter(filter).sort(sort);
  },

  getStack: (state) => (id) => {
    if (!id) return null;
    return state.stack[id];
  },

  getStackCollectionByEvent: (state, getters) => ({ event, isAdmitted = true } = {}) => {
    const e = getters.getEvent(event);

    const stackList = [];
    for (const stack of e.stack) {
      if (state.stack[stack] &&
        (!isAdmitted || state.stack[stack].status === 'admitted')) {
        stackList.push(state.stack[stack]);
      }
    }

    return stackList;
  },

  getStackCollection: (state, getters) => ({
    filter = () => true,
    sort,
  }) => {
    return typeof sort === 'undefined'
      ? getters.getAllStack.filter(filter)
      : getters.getAllStack.filter(filter).sort(sort);
  },

  getAllStack: (state) => {
    const stackList = [];
    for (const id of Object.keys(state.stack)) {
      if (typeof +id === 'number') {
        stackList.push(state.stack[id]);
      }
    }
    return stackList;
  },

  getNewsCollectionByStack: (state, getters) => ({ stack, isAdmitted = true } = {}) => {
    const s = getters.getStack(stack);
    if (!s) return [];
    const newsIdList = s.news;

    const newsList = [];
    for (const news of newsIdList) {
      if (state.news[news] &&
        (!isAdmitted || state.news[news].status === 'admitted')) {
        newsList.push(state.news[news]);
      }
    }

    return newsList;
  },

  getNewsCollection: (state, getters) => ({
    filter = () => true,
    sort,
  }) => {
    return typeof sort === 'undefined'
      ? getters.getAllNews.filter(filter)
      : getters.getAllNews.filter(filter).sort(sort);
  },

  getAllNews: (state) => {
    const newsList = [];
    for (const id of state.newsId) {
      newsList.push(state.news[id]);
    }
    return newsList;
  },

  getNews: (state) => ({ id } = {}) => {
    if (!id) return;
    return state.news[id];
  },

  getPendingNews: (state, getters) => ({ id } = {}) => {
    if (id) {
      return getters.getAllNews.filter(n => n.event === id && n.status !== 'admitted');
    } else {
      return getters.getAllNews.filter(n => n.status !== 'admitted');
    }
  },

  getSubscriptionList(state, getters) {
    if (getters.isLoggedIn) {
      return state.client.subscriptions;
    } else {
      return [];
    }
  },

  getLastSubscription(state, getters) {
    const subscriptionList = getters.getSubscriptionList;
    if (subscriptionList.length > 0) {
      return subscriptionList[0];
    } else {
      return null;
    }
  },

  getEventSubscriptionList: (state, getters) => (name) => {
    if (!name) return;
    const subscriptionList = getters.getSubscriptionList;
    const event = getters.getEvent(name);
    const eventSubscriptionList = (subscriptionList || []).filter(
      (s) => s.event === event.id,
    );
    return eventSubscriptionList;
  },

  getAuth: (state, getters) => (site) => {
    if (getters.isLoggedIn) {
      return state.client.auths.filter((a) => a.site === site);
    }

    return null;
  },

  getAvailableAuths(state) {
    return state.availableAuths;
  },

  getFetchingStatus: (state) => (name) => {
    return state.fetchingStatus[name];
  },
};
