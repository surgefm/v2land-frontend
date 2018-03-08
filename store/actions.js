import $ from 'postman-url-encoder';

export default {
  async getEvent({ dispatch, state, getters }, name) {
    if (!getters.isServer) {
      for (const i in state.event) {
        if ((state.event[i].id === name || state.event[i].name === name) &&
          state.event[i].news) {
          return state.event[i];
        }
      }
    }
    return dispatch('fetchEvent', name);
  },

  async fetchEvent({ commit }, name) {
    const url = $.encode(`event/${name}`);
    try {
      const { data } = await this.$axios.get(url);
      commit('setEvent', {
        name: data.name,
        detail: data,
      });
      return data;
    } catch (err) {
      return null;
    }
  },

  async getEventList({ commit, state }, { mode = 'latest', where } = {}) {
    if (mode === 'latest' || !state.event) {
      let url = $.encode('event');
      if (where) {
        url += '?where=' + encodeURIComponent(JSON.stringify(where));
      }

      try {
        const { data } = await this.$axios.get(url);
        for (const event of (data.eventList || data)) {
          event.image = event['header_image'];
          commit('setEvent', {
            name: event.name,
            detail: event,
          });
        }
        return data.eventList || data;
      } catch (err) {
        return [];
      }
    } else {
      return Object.keys(state.event).map((key) => state.event[key]);
    }
  },

  async getAllEventList({ dispatch }) {
    return dispatch('getEventList', { mode: 'all' });
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

  async getNews({ commit }, id) {
    const url = $.encode('news/' + id);
    const { data: news } = await this.$axios.get(url);
    commit('setNews', news);
    return news;
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
