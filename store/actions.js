import $ from 'postman-url-encoder';

function isEmptyObject(map) {
  for (const key in map) {
    if (map.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export default {
  async getEvent({ dispatch, state, getters }, name) {
    let silent = false;
    if (typeof name === 'undefined') {
      throw new TypeError('name should not be undefined');
    } else if (typeof name === 'object') {
      silent = name.silent;
      name = name.name;
    }

    const event = getters.getEvent(name);
    if (event) return event;

    return dispatch('fetchEvent', { name, silent });
  },

  async fetchEvent({ commit }, { name, includes = {}, silent = false }) {
    if (typeof name === 'undefined') {
      throw new TypeError('name should not be undefined');
    }
    let url = `event/${name}`;
    if (includes.stack && includes.news) {
      url += `?stack=${includes.stack}&news=${includes.news}`;
    }
    url = $.encode(url);
    try {
      const { data } = await this.$axios.get(url, { progress: false });
      commit('setEvent', { event: data });
      return data;
    } catch (err) {
      if (!silent && err.response && err.response.status === 404) {
        this.app.$message.error('该事件不存在或未被公开');
      } else {
        console.error(err);
      }
      return null;
    }
  },

  async fetchEventList({ commit, state }, { where, page } = { page: 1 }) {
    let eventList = [];

    if (typeof where === 'undefined') {
      where = {
        status: 'admitted',
      };
    }

    try {
      let data;

      const { status, ...rest } = where;

      if (isEmptyObject(rest) && typeof status === 'string') {
        // GET method
        const url = `event?page=${page || 1}&status=${status || 'admitted'}`;
        const resp = await this.$axios.get($.encode(url));
        data = resp.data;
      } else {
        // 兼容老代码
        // 使用 POST 方法
        const resp = await this.$axios.post($.encode('event/list'), { where, page });
        data = resp.data;
      }

      for (const event of data.eventList) {
        commit('setEvent', { event: event });
      }
      eventList = data.eventList;
    } catch (err) {
      this.app.$message.error('获取事件失败，请刷新重试');
      console.error(err);
    }

    return eventList;
  },

  async fetchStackList({ commit }, { where = { status: 'admitted' }, page = 1 }) {
    let stackList = [];

    try {
      const { data } = await this.$axios.post('stack/list', { where, page });
      for (const stack of data.stackList) {
        commit('setStack', { stack });
      }
      stackList = data.stackList;
    } catch (err) {
      console.error(err);
    }

    return stackList;
  },

  async getNewsList({ commit }, { where, page }) {
    try {
      const { data } = await this.$axios.post('news', { where, page });
      if (data.newsList && data.newsList.length > 0) {
        for (const news of (data.newsList)) {
          commit('setNews', { news, sortNeeded: false });
        }
        commit('sortNewsId', { id: data.newsList[0].stack });
      }
      return data.newsList;
    } catch (err) {
      console.error('actions.getNewsList: ' + err);
      return [];
    }
  },

  async getPendingNews({ commit }, name) {
    if (name) {
      const url = $.encode(`event/${name}/pending`);
      const { data } = await this.$axios.get(url);

      for (const news of data.newsCollection) {
        commit('setNews', { news });
      }

      return data.newsCollection;
    } else {
      const url = $.encode(`news/pending`);
      const { data } = await this.$axios.get(url);

      for (const news of data.newsCollection) {
        commit('setNews', { news });
      }

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

  async getNews({ state, commit, getters }, id) {
    if (!id) return;
    const found = getters.getNews({ id });
    if (found && found.contribution && found.contribution[0] &&
      found.contribution[0].data) {
      return found;
    }

    const url = $.encode('news/' + id);
    const { data } = await this.$axios.get(url);
    if (!data) return false;
    commit('setNews', { news: data.news });
    return data.news;
  },

  async editNews({ dispatch }, { id, data }) {
    const url = $.encode(`news/${id}`);
    const news = {};
    for (const attr of ['title', 'abstract', 'time', 'comment', 'status', 'stack', 'source']) {
      if (data[attr]) {
        news[attr] = data[attr];
      }
    }
    return this.$axios.put(url, news);
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
