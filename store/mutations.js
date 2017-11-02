import Vue from 'vue'

export default {
  setEvent (state, { name, detail }) {
    state.event[name] = Object.assign({}, detail)
  },

  setSubscribeMode (state, mode) {
    state.subscribe = { ...state.subscribe, mode }
  },

  setSubscribeMethod (state, contact) {
    state.subscribe = { ...state.subscribe, contact }
  },

  setPendingNews (state, { name, newsCollection }) {
    Vue.set(state.pendingNews, name, Array.from(newsCollection))
  },

  setClient (state, client) {
    state.client = Object.assign({}, client)
  },

  setTemp (state, { label, temp }) {
    state.temp[label] = Object.assign({}, temp)
  }
}
