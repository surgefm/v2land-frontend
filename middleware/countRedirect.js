export default function countRedirect(ctx) {
  ctx.store.commit('addRedirectCount');
}
