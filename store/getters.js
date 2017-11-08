export default {
  isClientAdmin (state) {
    return state.client.role === 'admin'
  },

  isLoggedIn (state) {
    return !!state.client.username
  },

  getEvent: (state) => (name) => {
    return state.event[name]
  },

  getNewsCollection: (state) => (name) => {
    return state.event[name]
      ? state.event[name].newsCollection
      : []
  },

  getNews: (state) => ({name, id}) => {
    let newsSet = state.event[name]
      ? state.event[name].newsCollection.filter(news => news.id === id)
      : []

    return newsSet.length > 0 ? newsSet[0] : null
  },

  getPendingNews: (state) => (name) => {
    if (name) {
      return state.pendingNews[name] || []
    } else {
      return state.allPendingNews
    }
  },

  getSubscriptionList (state, getters) {
    if (getters.isLoggedIn) {
      return state.client.subscriptionList.filter(s => s.status === 'active')
    } else {
      return []
    }
  }
}
