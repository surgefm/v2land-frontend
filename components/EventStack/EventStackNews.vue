<template>
  <div v-if="news">
    <div
      class="news-item"
      :class="!showDetail || 'detailed'"
      @click="toggleNews"
      ref="container"
    >
      <div class="info" ref="info">
        <img class="source-icon" v-lazy="'/defaultSource.png'" />
        <span class="title">{{ news.title }}</span>
        <span class="abstract">{{ news.abstract }}</span>
        <div class="shadow" ref="shadow" />
      </div>
      <span class="source" ref="source">{{ news.source }}</span>
    </div>
    <div class="news-detail" v-if="showDetail">
      <event-news-content :news="news" />
    </div>
  </div>
</template>

<script>
import EventNewsContent from '~/components/EventNews/EventNewsContent.vue';

export default {
  name: 'EventStackNews',
  props: {
    'news': Object,
  },
  data() {
    return {
      showDetail: false,
      lastWidth: null,
    };
  },
  methods: {
    scale() {
      const containerEl = this.$refs.container;
      if (!containerEl) return;
      if (!this.lastWidth) {
        this.lastWidth = containerEl.offsetWidth;
      } else if (Math.abs(containerEl.offsetWidth - this.lastWidth) < 14) {
        return;
      }
      const sourceEl = this.$refs.source;
      const infoEl = this.$refs.info;
      const shadowEl = this.$refs.shadow;
      const width = sourceEl.offsetWidth;
      const showShadow = infoEl.offsetWidth >= containerEl.offsetWidth - 32 - width ? 1 : 0;
      shadowEl.setAttribute('style', `display: block; opacity: ${showShadow}; right: ${width + 4}px`);
      infoEl.setAttribute('style', `max-width:calc(100% - ${width}px)`);
    },
    toggleNews() {
      this.showDetail = !this.showDetail;
      if (!this.showDetail) this.scale();
    },
  },
  mounted() {
    window.addEventListener('resize', this.scale);
    this.scale();
  },
  components: {
    'event-news-content': EventNewsContent,
  },
};
</script>

<style lang="scss" scoped>
  .news-item {
    display: flex;
    padding: .25rem .5rem;
    margin: 0 1rem;
    border-radius: .25rem;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    user-select: none !important;
  }

  .news-item:hover {
    background-color: #f4f9ff;
  }

  .info {
    overflow: hidden;
    white-space: nowrap;
    max-width: calc(100% - 4rem);
    display: flex;
    align-items: center;
  }

  .info * {
    line-height: 1.8;
  }

  .source-icon {
    width: 16px;
    height: 16px;
    border-radius: 1px;
    margin-right: .25rem;
  }

  .title {
    font-weight: bold;
    margin-right: .25rem;
  }

  .abstract {
    color: #828282;
  }

  .source {
    position: absolute;
    right: .5rem;
    line-height: 1.8;
  }

  .news-detail {
    padding: 0 1rem .25rem 1rem;
    margin: 0 1rem .5rem 1rem;
    background-color: #f4f9ff;
    border-bottom-left-radius: .25rem;
    border-bottom-right-radius: .25rem;
  }

  .detailed {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background-color: #e9f3fe !important;
  }

  .shadow {
    content: "";
    display: none;
    text-align: right;
    position: absolute;
    bottom: 0;
    width: 4rem;
    height: 100%;
    transition: opacity .2s;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 90%);
  }

  .news-item:hover .shadow {
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(244, 249, 255, 1) 90%);
  }

  .detailed .shadow {
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(233, 243, 254, 1) 90%) !important;
  }

  @media (max-width: 600px) {
    .news-item {
      margin: 0;
    }

    .news-detail {
      margin: 0 0 .5rem 0;
    }
  }
</style>
