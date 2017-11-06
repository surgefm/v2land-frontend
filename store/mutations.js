import Vue from 'vue'

export default {
  setEvent (state, { name, detail }) {
    Vue.set(state.event, name, Object.assign({}, detail))
  },

  setSubscribeMode (state, mode) {
    Vue.set(state, 'subscribe', { ...state.subscribe, mode })
  },

  setSubscribeMethod (state, contact) {
    Vue.set(state, 'subscribe', { ...state.subscribe, contact })
  },

  setPendingNews (state, { name, newsCollection }) {
    if (newsCollection) {
      Vue.set(state.pendingNews, name, Array.from(newsCollection))
    }
  },

  setAllPendingNews (state, newsCollection) {
    if (newsCollection) {
      Vue.set(state, 'allPendingNews', Array.from(newsCollection))
    }
  },

  setClient (state, client) {
    Vue.set(state, 'client', Object.assign({}, client))
  },

  setTemp (state, { label, temp }) {
    Vue.set(state.temp, label, Object.assign({}, temp))
  }
}
