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

    const checkPinyin = true;
    let change = false;
    if (['event-admit', 'event-post'].includes(route.name) ||
      route.name.includes('event-edit')) {
      return;
    }

    let name = route.name;
    let news = route.params.news;
    if (event.pinyin && route.name === 'event') {
      name = 'event-pinyin';
      change = true;
    } else if (news) {
      name = +news ? 'event-pinyin-news' : 'event-pinyin';
    }

    if (route.query.news) {
      news = route.query.news;
      name = 'event-pinyin-news';
      delete route.query.news;
    }

    if (name === 'event-news' && !(+news)) {
      name = 'event-pinyin';
      change = true;
    }

    if (change ||
      (+event.id !== +route.params.name) ||
      (checkPinyin && event.pinyin && ![route.params.pinyin, route.params.news].includes(event.pinyin)) ||
      (route.params.news !== news) ||
      (name === 'event-news' && !+news)) {
      const params = {
        name: event.id,
        pinyin: event.pinyin,
        news: news,
      };

      return redirect({
        ...route,
        params,
        name,
      });
    }
  }
};
