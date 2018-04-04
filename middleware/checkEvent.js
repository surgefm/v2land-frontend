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

    let checkPinyin = true;
    if (['name-admit', 'name-post'].includes(route.name) ||
      route.name.includes('name-edit')) {
      checkPinyin = false;
    }

    let name = route.name;
    let news = route.params.news;
    if (event.pinyin && route.name === 'name') {
      name = 'name-pinyin';
    } else if (!news && (+route.params.pinyin || +route.query.news)) {
      name = 'name-pinyin-news';
      news = +route.params.pinyin || +route.query.news;
      delete route.query.news;
    }

    if (+event.id !== +route.params.name ||
      (checkPinyin && event.pinyin && event.pinyin !== route.params.pinyin) ||
      (route.params.news !== news)) {
      return redirect({
        ...route,
        params: {
          ...route.params,
          name: event.id,
          pinyin: event.pinyin,
          news,
        },
        name,
      });
    }
  }
};
