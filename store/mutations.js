import Vue from 'vue';
import cleanState from '~/store/state';
import getSortedId from '~/utils/getSortedId';

const mutations = {
  setEvent(state, { event }) {
    event.stack = event.stack || [];
    const stackId = [];
    for (const stack of event.stack) {
      mutations.setStack(state, { stack });
      stackId.push(stack.id);
    }

    event.stack = stackId;
    event.id = +event.id;
    if (event['header_image']) {
      event.image = event['header_image'];
      delete event['header_image'];
    }

    // replace pre-existing event if there is one
    for (const id of state.eventId) {
      if (id === event.id) {
        for (stack of state.event[id].stack) {
          if (!event.stack.includes(stack)) {
            event.stack.push(stack);
          }
        }
        Vue.set(state.event, id, event);
        mutations.sortStackId(state, { name: event.id });
        return state.event[id];
      }
    }

    // create a new event if there is no pre-existing one
    // set state.eventId and state.eventName for convenience
    state.eventId.push(event.id);
    Vue.set(state.event, event.id, event);
    Vue.set(state.eventName, event.name, event.id);

    return event;
  },

  setStack(state, { stack }) {
    stack.news = stack.news || [];
    const newsId = [];
    for (const news of stack.news) {
      mutations.setNews(state, { news });
      newsId.push(news.id);
    }
    stack.news = newsId;
    stack.id = +stack.id;

    if (typeof stack.event === 'object') {
      const event = stack.event;
      stack.event = +event.id;
      mutations.setEvent(state, { event });
    }

    // replace pre-existing stack if there is one
    for (let i = 0; i < state.stack.length; i++) {
      const s = state.stack[i];
      if (s.id === stack.id) {
        for (news of s.news) {
          if (!stack.news.includes(news)) {
            stack.news.push(news);
          }
        }
        Vue.set(state.stack, i, stack);
        mutations.sortNewsId({ id: stack.id });
        return state.stack[i];
      }
    }

    // create a new stack if there is no pre-existing one
    Vue.set(state.stack, stack.id, stack);

    const e = state.event[stack.event];
    if (e && !e.stack.includes(stack.id)) {
      e.stack.push(stack.id);
    }

    return stack;
  },

  setNews(state, { news }) {
    if (typeof news.event === 'object') {
      const event = news.event;
      news.event = +event.id;
      mutations.setEvent(state, { event });
    }

    if (typeof news.stack === 'object') {
      const stack = news.stack;
      news.stack = +stack.id;
      mutations.setStack(state, { stack });
    }

    Vue.set(state.news, news.id, news);

    const s = state.stack[news.stack];
    if (s && !s.news.includes(news.id)) {
      s.news.push(news.id);
    }
  },

  sortStackId(state, { name }) {
    const event = state.event[name] ||
      state.event[state.eventName[name]];
    if (!event) return;
    if (!event.stack) {
      Vue.set(state.event[name], 'stack', []);
    }

    const stackList = [];
    for (const stack of event.stack) {
      if (state.stack[stack]) stackList.push(state.stack[stack]);
    }

    const sortedId = getSortedId({
      collection: stackList,
      key: 'order',
    });

    Vue.set(state.event[name], 'stack', sortedId);
  },

  sortNewsId(state, { id }) {
    const news = state.stack[id];
    if (!news) return;

    const newsList = [];
    for (const news of stack.news) {
      if (state.news[news]) newsList.push(state.news[news]);
    }

    const sortedId = getSortedId({ collection: newsList });

    Vue.set(state.stack[id], 'news', sortedId);
  },

  resetAllStatus(state) {
    for (const key in state.fetchingStatus) {
      if (state.fetchingStatus.hasOwnProperty(key)) {
        state.fetchingStatus[key].status = 'initial';
      }
    }
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

export default mutations;
