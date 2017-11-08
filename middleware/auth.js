import axios from '~/plugins/axios'
import Cookie from 'cookie'

export default async function ({ route, store, req }) {
  try {
    if (store.state.client.username) {
      return null
    }

    let cookie
    if (req && req.headers.cookie) {
      cookie = Cookie.parse(req.headers.cookie)
      if (!cookie.accessToken) {
        return store.commit('setClient', {})
      }
    } else if (req && !req.headers.cookie) {
      return store.commit('setClient', {})
    } else if (!store.state.client.username) {
      cookie = Cookie.parse(document.cookie)
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
  } catch (err) {}
}
