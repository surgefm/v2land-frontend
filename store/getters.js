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
    try {
      // eslint-disable-next-line
      document.getElementById
      return false;
    } catch (err) {
      return true;
    }
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
    if (state.event[name]) {
      return state.event[name];
    }

    for (const i in state.event) {
      if (state.event[i] && +state.event[i].id === +name) {
        return state.event[i];
      }
    }

    return null;
  },

  getEventList: (state) => (filter = () => true) => {
    const eventList = [];
    for (const name of Object.keys(state.event)) {
      if (typeof state.event[name] === 'object' &&
        state.event[name].name && filter(state.event[name])) {
        eventList.push(state.event[name]);
      }
    }
    eventList.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return eventList;
  },

  getNewsCollection: (state) => (name) => {
    return state.event[name]
      ? state.event[name].news
      : [];
  },

  getNews: (state) => ({ name, id }) => {
    if (!name) {
      name = state.news[id];
    }

    if (name) {
      const newsSet = (state.event[name] && state.event[name].news)
        ? state.event[name].news.filter((news) => news.id.toString() === id.toString())
        : [];

      return newsSet.length > 0 ? newsSet[0] : null;
    } else {
      for (const item of Object.getOwnPropertyNames(state.event)) {
        const event = state.event[item] || {};
        const newsList = event.news || [];
        for (const news of newsList) {
          if (news.id.toString() === id.toString() || news.title === id) {
            return news;
          }
        }
      }
    }

    return null;
  },

  getPendingNews: (state) => (name) => {
    if (name) {
      return state.pendingNews[name] || [];
    } else {
      return state.allPendingNews;
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
    const eventSubscriptionList = (subscriptionList || []).filter((s) => s.event === event.id);
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
};
