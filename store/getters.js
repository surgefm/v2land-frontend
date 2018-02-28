export default {
  isClientAdmin(state) {
    return state.client.role === 'admin';
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

  getEvent: (state) => (name) => {
    return state.event[name];
  },

  getNewsCollection: (state) => (name) => {
    return state.event[name]
      ? state.event[name].news
      : [];
  },

  getNews: (state) => ({ name, id }) => {
    const newsSet = state.event[name]
      ? state.event[name].news.filter((news) => news.id.toString() === id.toString())
      : [];

    return newsSet.length > 0 ? newsSet[0] : null;
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
      return state.client.subscriptions.filter((s) => s.status === 'active');
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
