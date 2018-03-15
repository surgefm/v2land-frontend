/**
 *  doc here
 */
export default async function({ route, app, store, redirect }) {
  if (route.params.name && route.params.name !== 'admin') {
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

      return redirect((from || '/') + '?status=event_not_found');
    }

    if (event.name !== route.params.name) {
      return redirect({
        ...route,
        params: {
          ...route.params,
          name: event.name,
        },
      });
    }
  }
};
