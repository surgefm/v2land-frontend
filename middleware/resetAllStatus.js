

export default function({ store }) {
  if (process.server) {
    store.commit('resetAllStatus');
  }
}
