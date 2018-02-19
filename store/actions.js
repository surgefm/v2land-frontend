import $ from 'postman-url-encoder'

export default {
  async getEvent ({ dispatch, state }, name) {
    if (state.event[name] && state.event[name].news) {
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
      return null
    }
  },

  async getEventList ({ commit }, mode = 'latest') {
    let url = $.encode(`event` + (mode === 'latest' ? '/' : '/'))
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
      return []
    }
  },

  async getAllEventList ({ dispatch }) {
    return dispatch('getEventList', 'all')
  },

  async getPendingNews ({ commit }, name) {
    if (name) {
      let url = $.encode(`event/${name}/pending`)
      let { data } = await this.$axios.get(url)

      commit('setPendingNews', {
        name,
        newsCollection: data.eventCollection
      })

      return data.newsCollection
    } else {
      let url = $.encode(`event/pending`)
      let { data } = await this.$axios.get(url)
      commit('setAllPendingNews', data.eventCollection)

      return data.newsCollection
    }
  },

  async editEvent ({ dispatch }, { name, data }) {
    let url = $.encode(`event/${name}`)
    return this.$axios.put(url, data)
  },

  async createEvent ({ dispatch, getters }, { data }) {
    let url = $.encode(getters.isClientAdmin ? 'event' : 'event/news')
    return this.$axios.post(url, data)
  },

  async editNews ({ dispatch }, { id, data }) {
    let url = $.encode(`news/${id}/edit`)
    return this.$axios.patch(url, data)
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

  async getAvailableAuthMethod ({ state, commit }) {
    let isServer
    try {
      isServer = document.getElementById
      isServer = false
    } catch (err) {
      isServer = true
    }

    if (state.availableAuths.length > 0 && !isServer) {
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
