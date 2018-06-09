<template>
  <div :class="['stack-container', stack.status]">
    <div class="top">
      <span class="title">{{ stack.title }}</span>
    </div>
    <p class="description">{{ stack.description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    'stack': Object,
  },
};
</script>

<style lang="scss" scoped>
  .stack-container {
    background-color: rgb(244, 249, 255);
    max-width: 20rem;
    border-radius: .25rem;
    margin: .25rem 0;
    cursor: grab;
  }

  .top {
    width: 100%;
    background-color: rgb(233, 243, 254);
    padding: 0 .5rem;
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
  }

  .title {
    font-weight: bold;
    line-height: 1.8;
  }

  .description {
    padding: 0 .5rem;
  }

  .stack-container.pending {
    background-color: rgba(245, 215, 110, .4)
  }

  .pending .top {
    background-color: rgba(244, 208, 63, .5);
  }
</style>
