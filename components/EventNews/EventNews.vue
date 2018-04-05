<template>
  <card v-if="news" class="news-wrapper">
    <span
      v-if="order"
      v-clipboard="newsUrl"
      v-analytics="{
        action: 'buttonClick',
        label: 'newsOrderNumber',
        value: news.id
      }"
      @success="copySuccess"
      class="order light-font"
    >
      {{ order }}
    </span>
    <event-news-content
      :news="news"
      :order="order"
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
      order: Number,
      mode: String,
      event: Object,
    },
    computed: {
      newsUrl() {
        const event = this.event || this.news.event;
        if (event.id) {
          return `${config.baseUrl}${event.id}/${this.news.id}/${event.pinyin}`;
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
  @import "../../assets/variables.scss";

  .news-wrapper {
    position: relative;
    padding: 1rem 2rem;
  }

  .order {
    font-size: 4.25rem;
    height: 4.25rem;
    line-height: 1;
    position: absolute;
    right: calc(100% - 1.25rem);
    top: 1rem;
    font-family: 'Times New Roman', Times, serif;
    cursor: pointer;
    font-weight: 900;
    transition: all .2s;
  }

  @media (min-width: 600px) {
    .above-cover .order {
      text-shadow: -.25rem 0 0 #000;
      background-color: $light-color;
      color: #fff !important;
      border-radius: .25rem;
      padding: 0 .25rem;
      box-shadow: -.25rem 0 0 #000;
      opacity: 0;
    }
  }

  @media (max-width: 600px) {
    .order {
      position: relative;
      right: initial;
      top: 0;
      left: -.25rem;
      height: 4rem;
      float: left;
      text-shadow: none !important;
    }

    .news-wrapper {
      padding: .75rem 1rem;
    }
  }
</style>
