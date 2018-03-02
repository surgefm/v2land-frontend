<template>
  <div class="description">
    <span>
      <slot />
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      description: String,
    },
  };
</script>

<style lang="scss" scoped>
  .description {
    color: #333;
    padding: 0;
    margin-top: 1rem;
  }
</style>
