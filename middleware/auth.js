import Cookie from 'cookie'

export default async function (ctx) {
  if (ctx.req) {
    ctx.store.commit('cleanAll')
  }
  await authThirdParty(ctx)
  await getClientData(ctx)
}

async function authThirdParty ({ route, store, req, res, app }) {
  if (route.query.access_token) {
    await app.axios.get('clients/detail', {
      headers: { Authorization: route.query.access_token }
    })

    let expireTime = new Date(Date.now() + 60 * 60 * 24 * 14 * 1000)
    let cookie = Cookie.serialize('accessToken', route.query.access_token, {
      expires: expireTime
    })

    if (req) {
      res.setHeader('Set-Cookie', [cookie])
    } else {
      document.cookie = cookie
    }
  } else {
    return null
  }
}

async function getClientData ({ route, store, req, redirect }) {
  if (req) {
    try {
      await store.dispatch('getClient')
    } catch (err) {
      if (err.response.status !== 401) {
        console.log(err)
      }
    }
  }
}
