<template>
  <div
    v-if="event"
    class="status"
  >
    <span>事件</span>
    <span v-if="event.stackCount || event.newsCount">共有</span>
    <span v-if="event.stackCount">
      <span class="light-font number">
        {{ event.stackCount }}
      </span>
      个进展</span>
    <span v-if="event.stackCount && event.newsCount">、</span>
    <span v-if="event.newsCount">
      <span class="light-font number">
        {{ event.newsCount }}
      </span>
      条新闻
    </span>
    <span
      v-if="!event.stackCount && !event.newsCount"
      class="light-font"
    >
      尚无相关新闻
    </span>
  </div>
</template>

<script>
export default {
  props: {
    event: Object,
  },
};
</script>

<style lang="scss" scoped>
  .status {
    font-size: .9rem;
  }

  .number {
    font-size: bold;
  }

  .margin-left {
    margin-left: .75rem;
  }

  @media (max-width: 600px) {
    .margin-left {
      margin-left: 0;
    }
  }
</style>
