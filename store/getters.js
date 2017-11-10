export default {
  isClientAdmin (state) {
    return state.client.role === 'admin'
  },

  isLoggedIn (state) {
    return !!state.client.username
  },

  getClient (state) {
    return state.client
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
  },

  getLastSubscription (state, getters) {
    let subscriptionList = getters.getSubscriptionList
    if (subscriptionList.length > 0) {
      return subscriptionList[0]
    } else {
      return null
    }
  },

  getEventSubscriptionList: (state, getters) => (name) => {
    let subscriptionList = getters.getSubscriptionList
    let eventSubscriptionList = (subscriptionList || []).filter(s => s.eventName === name)
    if (eventSubscriptionList.length > 0) {
      return eventSubscriptionList
    } else {
      return null
    }
  },

  getAuth: (state, getters) => (site) => {
    if (getters.isLoggedIn) {
      let auths = state.client.authList.filter(a => a.site === site)
      if (auths.length > 0) {
        return auths[0]
      }
    }

    return null
  }
}
