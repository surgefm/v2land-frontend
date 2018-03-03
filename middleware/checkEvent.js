/**
 *  doc here
 */
export default async function({ route, app, store, redirect }) {
  if (route.params.name) {
    const event = await store.dispatch('getEvent', route.params.name);
    if (!event || event.status !== 'admitted') {
      let from = app.context.from;
      if (from && from.name.includes('login')) {
        from = '/';
      } else if (from && from.fullPath) {
        from = from.fullPath;
      } else {
        from = null;
      }

      redirect((from || '/') + '?status=event_not_found');
    }
  }
};
