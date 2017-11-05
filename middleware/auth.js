import axios from '~/plugins/axios'
import Cookie from 'cookie'

export default async function ({ route, store, req }) {
  try {
    let cookie
    if (req && req.headers.cookie) {
      cookie = Cookie.parse(req.headers.cookie)
    } else if (req && !req.headers.cookie) {
      store.commit('setClient', {})
    } else if (!store.state.client.role) {
      cookie = Cookie.parse(document.cookie)
    }
    if (cookie.accessToken) {
      let { data } = await axios.get('clients/detail', {
        headers: {
          Authorization: cookie.accessToken
        }
      })
      store.commit('setClient', data.detail)
    }
  } catch (err) { }
}
