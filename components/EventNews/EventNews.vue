<template>
  <card v-if="news" class="news-container hover">
    <span
      v-if="order"
      v-clipboard="newsUrl"
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
    />
  </card>
</template>

<script>
  import config from '~/const';

  export default {
    props: {
      news: Object,
      order: Number,
      mode: String,
      event: Object,
    },
    computed: {
      newsUrl() {
        return config.baseUrl +
          (this.news.event.id || this.news.event) +
          '?news=' + this.news.id;
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

  .news-container {
    position: relative;
  }

  .order {
    font-size: 4.25rem;
    height: 4.25rem;
    line-height: 1;
    position: absolute;
    right: calc(100% - 1.25rem);
    top: 1.5rem;
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
  }
</style>
