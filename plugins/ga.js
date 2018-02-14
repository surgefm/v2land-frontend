import config from '~/const'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

export default ({ app, store }) => {
  const router = app.router
  Vue.use(VueAnalytics, {
    router,
    id: config.ga,
    set: store.getters.getClient.id
      ? [{ field: 'userId', value: store.getters.getClient.id }]
      : []
  })
  app.$ga = Vue.$ga
}
