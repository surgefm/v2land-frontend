<template>
  <div class="news-item" v-if="news" ref="container">
    <div class="info" ref="info">
      <img class="source-icon" v-lazy="'/defaultSource.png'" />
      <span class="title">{{ news.title }}</span>
      <span class="abstract">{{ news.abstract }}</span>
      <div class="shadow" ref="shadow" />
    </div>
    <span class="source" ref="source">{{ news.source }}</span>
  </div>
</template>

<script>
export default {
  name: 'EventStackNews',
  props: {
    'news': Object,
  },
  data() {
    return {
      lastWidth: null,
    };
  },
  methods: {
    scale() {
      const containerEl = this.$refs.container;
      if (!this.lastWidth) {
        this.lastWidth = containerEl.offsetWidth;
      } else if (Math.abs(containerEl.offsetWidth - this.lastWidth) < 14) {
        return;
      }
      const sourceEl = this.$refs.source;
      const infoEl = this.$refs.info;
      const shadowEl = this.$refs.shadow;
      const width = sourceEl.offsetWidth;
      console.log(infoEl.offsetWidth, containerEl.offsetWidth - 32 - width);
      if (infoEl.offsetWidth >= containerEl.offsetWidth - 32 - width) {
        shadowEl.setAttribute('style', `opacity: 1; right: ${width}px`);
      } else {
        shadowEl.setAttribute('style', 'opacity: 0;');
      }
      infoEl.setAttribute('style', `max-width:calc(100% - ${width}px)`);
    },
  },
  mounted() {
    this.scale();
    window.addEventListener('resize', this.scale);
  },
};
</script>

<style lang="scss" scoped>
  .news-item {
    display: flex;
    padding: .25rem 1rem;
    margin: 0 1rem;
    border-radius: .25rem;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    user-select: none !important;
  }

  .news-item:hover {
    background-color: #eee;
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

  .shadow {
    content: "";
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 4rem;
    width: 4rem;
    height: 100%;
    transition: opacity .2s;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 90%);
  }

  .news-item:hover .shadow {
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(238, 238, 238, 1) 90%);
  }
</style>
