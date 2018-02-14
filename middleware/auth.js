export default async function (ctx) {
  if (ctx.req) {
    ctx.store.commit('cleanAll')
  }

  await getClientData(ctx)
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
