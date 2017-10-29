<template>
  <div class="description">
    <span class="light-font">
      <slot></slot>
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      description: String
    }
  }
</script>

<style scoped>
  .description {
    padding: 0;
    margin-top: 1rem;
  }
</style>
