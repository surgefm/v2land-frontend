import Cookie from 'cookie'
let axios = require('~/plugins/axios').default
let accessToken

export default async function (ctx) {
  try {
    await authThirdParty(ctx)
    await getClientData(ctx)
  } catch (err) { console.log(err) }
}

async function authThirdParty ({ route, store, req, res }) {
  accessToken = null
  if (route.query.access_token) {
    await axios.get('clients/detail', {
      headers: { Authorization: route.query.access_token }
    })

    let expireTime = new Date(Date.now() + 60 * 60 * 24 * 14 * 1000)
    let cookie = Cookie.serialize('accessToken', route.query.access_token, {
      expires: expireTime
    })

    if (req) {
      accessToken = route.query.access_token
      res.setHeader('Set-Cookie', [cookie])
    } else {
      document.cookie = cookie
    }
  } else {
    return null
  }
}

async function getClientData ({ route, store, req, redirect }) {
  try {
    let cookie
    if (accessToken) {
    } else if (req && req.headers.cookie) {
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

    if (accessToken || cookie.accessToken) {
      let { data } = await axios.get('clients/detail', {
        headers: {
          Authorization: accessToken || cookie.accessToken
        }
      })

      store.commit('setClient', data.detail)
      if (accessToken) {
        redirect(307, route.query.redirect || '', { auth_login: 'ok' })
      }
    } else {
      store.commit('setClient', {})
    }
  } catch (err) {
    return store.commit('setClient', {})
  }
}
