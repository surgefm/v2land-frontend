import axios from '~/plugins/axios'
import $ from 'postman-url-encoder'

export default {
  async getEvent ({ dispatch, commit, state }, name) {
    if (state.event[name]) {
      return state.event[name]
    }

    return dispatch('fetchEvent', name)
  },

  async fetchEvent ({ commit }, name) {
    let url = $.encode(`events/${name}/detail`)
    let { data } = await axios.get(url)
    commit('setEvent', {
      name,
      detail: data.detail
    })

    return data.detail
  },

  async getPendingNews ({ commit }, name) {
    let url = $.encode(`events/${name}/pending_news`)
    let { data } = await axios.get(url)

    commit('setPendingNews', {
      name,
      newsCollection: data.newsCollection
    })

    return data.newsCollection
  },

  async editEvent ({ dispatch }, { name, data }) {
    let url = $.encode(`events/${name}`)
    return axios.patch(url, data)
  },

  async editNews ({ dispatch }, { id, data }) {
    let url = $.encode(`news/${id}`)
    return axios.patch(url, data)
  }
}
