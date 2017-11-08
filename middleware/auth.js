import axios from '~/plugins/axios'
import Cookie from 'cookie'

export default async function ({ route, store, req }) {
  try {
    let cookie
    if (req && req.headers.cookie) {
      cookie = Cookie.parse(req.headers.cookie)
      if (!cookie.accessToken) {
        return store.commit('setClient', {})
      }
    } else if (req && !req.headers.cookie) {
      return store.commit('setClient', {})
    } else if (!req && store.state.client.username) {
      return
    } else if (!store.state.client.username) {
      cookie = Cookie.parse(document.cookie)
    } else {
      return store.commit('setClient', {})
    }

    if (cookie.accessToken) {
      let { data } = await axios.get('clients/detail', {
        headers: {
          Authorization: cookie.accessToken
        }
      })
      store.commit('setClient', data.detail)
    } else {
      store.commit('setClient', {})
    }
  } catch (err) {
    store.commit('setClient', {})
  }
}
