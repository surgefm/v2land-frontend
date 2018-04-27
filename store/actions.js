import $ from 'postman-url-encoder';

export default {
  async getEvent({ dispatch, state, getters }, name) {
    for (const i in state.event) {
      if ((state.event[i].id === name || state.event[i].name === name) &&
        state.event[i].news && state.event[i].news.length > 0) {
        return state.event[i];
      }
    }

    return dispatch('fetchEvent', name);
  },

  async fetchEvent({ commit }, name) {
    const url = $.encode(`event/${name}`);
    try {
      commit('setFetchingStatus', {
        name: 'getEvent',
        status: 'loading',
      });
      const { data } = await this.$axios.get(url, { progress: false });
      commit('setEvent', {
        name: data.name,
        detail: data,
      });
      commit('setFetchingStatus', {
        name: 'getEvent',
        status: 'loaded',
      });
      return data;
    } catch (err) {
      return null;
    }
  },

  async getEventList({ commit, state }, { where, page } = {}) {
    let eventList;
    const url = $.encode('event/list');

    if (!where) where = { status: 'admitted' };
    if (!page) page = 1;

    try {
      const { data } = await this.$axios.post(url, { where, page });
      for (const event of (data.eventList || data)) {
        event.image = event['header_image'];
        commit('setEvent', {
          name: event.name,
          detail: event,
        });
      }
      eventList = data.eventList || data;
    } catch (err) {
      eventList = [];
    }

    return eventList;
  },

  async getNewsList({ commit, dispatch }, { where, page }) {
    try {
      const { data } = await this.$axios.post('news', { where, page });
      for (const news of (data.newsList || data)) {
        await dispatch('setNews', news);
      }
      return data.newsList || data;
    } catch (err) {
      return [];
    }
  },

  async addNewList({ dispatch, commit, state }, newsList) {
    if (!newsList || !newsList.length) return;
    const event = await dispatch('getEvent', newsList[0].event);
    const oldNews = event.news;
    const newNews = oldNews.concat(news);
    newNews.sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });
    event.news = newNews;
    commit('setEvent', {
      name: event.name,
      detail: event,
    });
  },

  async getPendingNews({ commit }, name) {
    if (name) {
      const url = $.encode(`event/${name}/pending`);
      const { data } = await this.$axios.get(url);

      commit('setPendingNews', {
        name,
        ...data,
      });

      return data.newsCollection;
    } else {
      const url = $.encode(`news/pending`);
      const { data } = await this.$axios.get(url);
      commit('setAllPendingNews', data.newsCollection);

      return data.newsCollection;
    }
  },

  async editEvent({ dispatch }, { name, data }) {
    const url = $.encode(`event/${name}`);
    return this.$axios.put(url, data);
  },

  async createEvent({ dispatch, getters }, { data }) {
    const url = $.encode('event/');
    return this.$axios.post(url, data);
  },

  async getNews({ state, dispatch, getters }, id) {
    const found = getters.getNews({ id });
    if (found && found.contribution && found.contribution[0] &&
      found.contribution[0].data) {
      return found;
    }

    const url = $.encode('news/' + id);
    const { data } = await this.$axios.get(url);
    if (!data) return false;
    await dispatch('setNews', data.news);
    return data.news;
  },

  async setNews({ state, commit, dispatch }, news) {
    if (typeof news.event === 'number') {
      news.event = await dispatch('getEvent', news.event);
    }

    commit('setNews', news);
  },

  async editNews({ dispatch }, { id, data }) {
    const url = $.encode(`news/${id}`);
    return this.$axios.put(url, data);
  },

  async getClient({ commit }, id = 'me') {
    const url = $.encode('client/' + id);
    try {
      const { data } = await this.$axios.get(url);
      commit('setClient', { client: data.client, id });
      if (id === 'me') {
        this.app.$ga.set('userId', data.client.id);
      }
      return data.client;
    } catch (err) {
      return null;
    }
  },

  async getClientList({ commit }, where) {
    try {
      const { data } = await this.$axios.post('client', { where });
      commit('setClientList', data.clientList);
      return data.clientList;
    } catch (err) {
      throw err;
    }
  },

  async getSubscriptions({ commit, dispatch }) {
    const url = $.encode('client/me');
    const { data } = await this.$axios.get(url);
    commit('setSubscriptionList', data.client.subscriptions);
    return data.client.subscriptionList;
  },

  async logout({ commit }) {
    await this.$axios.get('client/logout');
    this.app.$ga.set('userId', null);
    commit('setClient', {});
  },

  async getAvailableAuthMethod({ state, commit, getters }) {
    if (state.availableAuths.length > 0 && !getters.isServer) {
      return state.availableAuths;
    } else {
      const { data } = await this.$axios.get('auth/options');
      state.availableAuths = ['fetched'];

      for (const property in data) {
        if (data[property] === true) {
          state.availableAuths.push(property);
        }
      }

      return state.availableAuths;
    }
  },
};
