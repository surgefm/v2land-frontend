import $ from 'postman-url-encoder'

export default {
  async getEvent ({ dispatch, state, getters }, name) {
    if (!getters.isServer && state.event[name] && state.event[name].news) {
      return state.event[name]
    }
    return dispatch('fetchEvent', name)
  },

  async fetchEvent ({ commit }, name) {
    let url = $.encode(`event/${name}`)
    try {
      let { data } = await this.$axios.get(url)
      commit('setEvent', {
        name: data.name,
        detail: data
      })
      return data
    } catch (err) {
      if (err.response) {
        this.app.$message.error(err.response.data.message)
      } else {
        this.app.$message.error('服务器连接失败')
      }
      return null
    }
  },

  async getEventList ({ commit, state }, { mode = 'latest', where } = {}) {
    if (mode === 'latest' || !state.event) {
      let url = $.encode('event')
      if (where) {
        url += '?where=' + encodeURIComponent(JSON.stringify(where))
      }

      try {
        let { data } = await this.$axios.get(url)
        for (let event of (data.eventList || data)) {
          event.image = event['header_image']
          commit('setEvent', {
            name: event.name,
            detail: event
          })
        }
        return data.eventList || data
      } catch (err) {
        if (err.response) {
          this.app.$message.error(err.response.data.message)
        } else {
          this.app.$message.error('服务器连接失败')
        }
        return []
      }
    } else {
      return Object.keys(state.event).map(key => state.event[key])
    }
  },

  async getAllEventList ({ dispatch }) {
    return dispatch('getEventList', { mode: 'all' })
  },

  async getPendingNews ({ commit }, name) {
    if (name) {
      let url = $.encode(`event/${name}/pending`)
      let { data } = await this.$axios.get(url)

      commit('setPendingNews', {
        name,
        ...data
      })

      return data.newsCollection
    } else {
      let url = $.encode(`news/pending`)
      let { data } = await this.$axios.get(url)
      commit('setAllPendingNews', data.newsCollection)

      return data.newsCollection
    }
  },

  async editEvent ({ dispatch }, { name, data }) {
    let url = $.encode(`event/${name}`)
    return this.$axios.put(url, data)
  },

  async createEvent ({ dispatch, getters }, { data }) {
    let url = $.encode('event/')
    return this.$axios.post(url, data)
  },

  async getNews ({ commit }, id) {
    let url = $.encode('news/' + id)
    let { data: news } = await this.$axios.get(url)
    commit('setNews', news)
    return news
  },

  async editNews ({ dispatch }, { id, data }) {
    let url = $.encode(`news/${id}`)
    return this.$axios.put(url, data)
  },

  async getClient ({ commit }) {
    let url = $.encode('client/me')
    try {
      let { data } = await this.$axios.get(url)
      commit('setClient', data.client)
      this.app.$ga.set('userId', data.client.id)
      return data.client
    } catch (err) {
      return null
    }
  },

  async getSubscriptions ({ commit, dispatch }) {
    let url = $.encode('client/me')
    let { data } = await this.$axios.get(url)
    commit('setSubscriptionList', data.client.subscriptions)
    return data.client.subscriptionList
  },

  async logout ({ commit }) {
    await this.$axios.get('client/logout')
    this.app.$ga.set('userId', null)
    commit('setClient', {})
  },

  async getAvailableAuthMethod ({ state, commit, getters }) {
    if (state.availableAuths.length > 0 && !getters.isServer) {
      return state.availableAuths
    } else {
      let { data } = await this.$axios.get('auth/options')
      state.availableAuths = ['fetched']

      for (let property in data) {
        if (data[property] === true) {
          state.availableAuths.push(property)
        }
      }

      return state.availableAuths
    }
  }
}