export default {
  setSubscribeMode (state, mode) {
    state.subscribe.mode = mode
  },

  setSubscribeMethod (state, { method, contact }) {
    state.subscribe.method = method
    state.subscribe.contact = contact
  }
}
