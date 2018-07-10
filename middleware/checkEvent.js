/**
 *  doc here
 */
export default async function({ route, app, store, redirect }) {
  if (route.params.name && route.params.name !== 'admin' && store.getters.isServer) {
    const event = await store.dispatch('getEvent', route.params.name);
    const isManager = store.getters.isClientManager;
    if (!event || (event.status !== 'admitted' && !isManager)) {
      let from = app.context.from;
      if (from && from.name.includes('login')) {
        from = '/';
      } else if (from && from.fullPath) {
        from = from.fullPath;
      } else {
        from = null;
      }

      return;
    }

    if (+event.id !== +route.params.name) {
      const params = {
        ...route.params,
        name: event.id,
      };

      return redirect({
        ...route,
        params,
      });
    }
  }
};
