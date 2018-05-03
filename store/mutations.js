import Vue from 'vue';
import cleanState from '~/store/state';

export default {
  setEvent(state, { name, detail }) {
    Vue.set(state.event, name, Object.assign({}, detail));

    if (detail.news) {
      for (const news of detail.news) {
        Vue.set(state.news, news.id, detail.name);
      }
    }
  },

  setEventList(state, list) {
    Vue.set(state, 'eventList', list);
  },

  appendEventList(state, list) {
    Vue.set(state, 'eventList', [...state.eventList, ...list]);
  },

  setFetchingStatus(state, { name, status, page }) {
    state.fetchingStatus[name].status = status;
    if (page && page > 1) {
      state.fetchingStatus[name].isRefresh = false;
    } else {
      state.fetchingStatus[name].isRefresh = true;
    }
  },

  setSubscribeMode(state, mode) {
    Vue.set(state, 'subscribe', { ...state.subscribe, mode });
  },

  setSubscribeMethod(state, contact) {
    Vue.set(state, 'subscribe', { ...state.subscribe, contact });
  },

  setNews(state, news) {
    let event = news.event;
    if (!state.event[event.name]) {
      event.news = [];
      Vue.set(state.event, event.name, event);
    }

    event = state.event[event.name];
    if (!event.news) {
      Vue.set(event, 'news', []);
    }

    for (let i = 0; i < event.news.length; i++) {
      if (event.news[i].id === news.id) {
        event.news[i] = { ...news };
        break;
      }
      if (i === event.news.length - 1) {
        event.news.push(news);
      }
    }

    Vue.set(state.news, news.id, event.name);
    Vue.set(state.event[event.name], 'news', event.news);
  },

  setPendingNews(state, { name, newsCollection }) {
    if (newsCollection) {
      Vue.set(state.pendingNews, name, Array.from(newsCollection));
    }
  },

  setAllPendingNews(state, newsCollection) {
    if (newsCollection) {
      Vue.set(state, 'allPendingNews', Array.from(newsCollection));
    }
  },

  setClient(state, { client = {}, id = 'me' }) {
    if (id === 'me') {
      Vue.set(state, 'client', Object.assign({}, client));
    }

    for (let i = 0; i < state.clientList.length; i++) {
      if (state.clientList[i].id === client.id) {
        return Vue.set(state.clientList, i, client);
      }
    }

    state.clientList.push(client);
  },

  setClientList(state, clientList) {
    for (const client of clientList) {
      for (let i = 0; i < state.clientList.length; i++) {
        if (state.clientList[i].id === client.id) {
          Vue.set(state.clientList, i, client);
          break;
        }
      }

      state.clientList.push(client);
    }
  },

  setSubscriptionList(state, list) {
    Vue.set(state.client, 'subscriptions', Array.from(list));
  },

  setTemp(state, { label, temp }) {
    Vue.set(state.temp, label, Object.assign({}, temp));
  },

  cleanAll(state) {
    for (const i in cleanState) {
      if (Array.isArray(cleanState[i])) {
        Vue.set(state, i, Array.from(cleanState[i]));
      } else {
        Vue.set(state, i, { ...cleanState[i] });
      }
    }
  },
};
