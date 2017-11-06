import axios from '~/plugins/axios'
import $ from 'postman-url-encoder'

export default {
  async getEvent ({ dispatch, state }, name) {
    if (state.event[name] && state.event[name].newsCollection) {
      return state.event[name]
    }

    return dispatch('fetchEvent', name)
  },

  async fetchEvent ({ commit }, name) {
    let url = $.encode(`events/${name}/detail`)
    try {
      let { data } = await axios.get(url)
      commit('setEvent', {
        name: data.detail.name,
        detail: data.detail
      })
      return data.detail
    } catch (err) {
      return null
    }
  },

  async getEventList ({ commit }, mode = 'latest') {
    let url = $.encode(`events` + (mode === 'latest' ? '/latest' : ''))
    try {
      let { data } = await axios.get(url)
      for (let event of (data.eventCollection || data)) {
        event.image = event['header_image']
        commit('setEvent', {
          name: event.name,
          detail: event
        })
      }
      return data.eventCollection || data
    } catch (err) {
      return []
    }
  },

  async getAllEventList ({ dispatch }) {
    return dispatch('getEventList', 'all')
  },

  async getPendingNews ({ commit }, name) {
    if (name) {
      let url = $.encode(`events/${name}/pending_news`)
      let { data } = await axios.get(url)

      commit('setPendingNews', {
        name,
        newsCollection: data.newsCollection
      })

      return data.newsCollection
    } else {
      let url = $.encode(`events/pending_news`)
      let { data } = await axios.get(url)
      commit('setAllPendingNews', data.newsCollection)

      return data.newsCollection
    }
  },

  async editEvent ({ dispatch }, { name, data }) {
    let url = $.encode(`events/${name}`)
    return axios.put(url, data)
  },

  async createEvent ({ dispatch, getters }, { data }) {
    let url = $.encode(getters.isClientAdmin ? 'events' : 'events/add')
    return axios.post(url, data)
  },

  async editNews ({ dispatch }, { id, data }) {
    let url = $.encode(`news/${id}/edit`)
    return axios.patch(url, data)
  }
}
