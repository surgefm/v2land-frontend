<template>
  <div class="description">
    <span><slot /></span>
    <div class="fade" v-if="fade" />
    <div class="hide" v-if="fade" />
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

  .fade {
    content: "";
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 5rem;
    height: 2rem;
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
