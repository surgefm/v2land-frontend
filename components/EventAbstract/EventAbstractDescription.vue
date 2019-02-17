<template>
  <div class="description">
    <span><slot /></span>
    <div
      v-if="fade"
      class="fade"
    />
    <div
      v-if="fade"
      class="hide"
    />
  </div>
</template>

<script>
export default {
  props: {
    description: String,
    fade: Boolean,
  },
};
</script>

<style lang="scss" scoped>
  .description {
    color: #333;
    padding: 0;
    margin-top: 1rem;
    position: relative;
  }

  span {
    line-height: 1.8 !important;
    display: block;
  }

  .fade {
    content: "";
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 5rem;
    height: 1.8rem;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 90%);
  }

  .hide {
    background-color: white;
    width: 100%;
    position: absolute;
    height: 100%;
    top: 100%;
  }
</style>
