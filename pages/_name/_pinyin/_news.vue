<template>
  <div />
</template>

<script>
import config from '~/const';

export default {
  data() {
    return {
      news: {},
    };
  },
  computed: {
    image() {
      return config.static + this.news.event.headerImage.imageUrl;
    },
  },
  async asyncData({ store, params }) {
    await store.dispatch('getEvent', params.name);
    const news = store.getters.getNews({
      id: params.news,
    });
    return { news };
  },
  head() {
    if (!this.event) return;
    const title = this.news.title + ' - ' + this.news.event.name;
    const image = this.news.event
      ? (this.news.event.headerImage ? this.image : null)
      : null;
    const description = this.news.abstract || null;
    return {
      title,
      meta: [
        description ? { hid: 'description', name: 'description', content: description } : {},
        { hid: 't:title', name: 'twitter:title', content: title },
        { hid: 'og:title', property: 'og:title', content: title },
        description ? { hid: 't:description', name: 'twitter:description', content: description } : {},
        description ? { hid: 'og:description', property: 'og:description', content: description } : {},
        image ? { hid: 't:image', name: 'twitter:image', content: image } : {},
        image ? { hid: 'og:image', property: 'og:image', content: image } : {},
      ],
    };
  },
};
</script>
