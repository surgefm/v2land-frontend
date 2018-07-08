<template>
  <card v-if="news" class="news-wrapper">
    <event-news-content
      :news="news"
      :mode="mode"
      :event="event"
      v-on:admitted="$emit('admitted')"
      v-on:rejected="$emit('rejected')"
    />
  </card>
</template>

<script>
  import config from '~/const';

  export default {
    name: 'EventNews',
    props: {
      news: Object,
      mode: String,
      event: Object,
    },
    computed: {
      newsUrl() {
        const event = this.event || this.news.event;
        if (event.id) {
          return `${config.baseUrl}${event.id}/${event.pinyin}/${this.news.id}`;
        }

        return `config.baseUrl${event}/${this.news.id}`;
      },
    },
    methods: {
      copySuccess() {
        this.$message.success('已将该新闻分享链接拷贝至剪贴板');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .news-wrapper {
    position: relative;
    padding: 1rem 2rem;
  }

  @media (max-width: 600px) {
    .news-wrapper {
      padding: .75rem 1rem;
    }
  }
</style>
