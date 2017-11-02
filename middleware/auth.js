import axios from '~/plugins/axios'
import Cookie from 'cookie'

export default async function ({ route, store, req }) {
  if (!store.state.client.role) {
    try {
      let cookie = Cookie.parse(
        req ? req.headers.cookie : document.cookie
      )
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
}
