<template>
  <span class="title">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
  .title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: .25rem;
    line-height: 1.5;
  }

  @media (max-width: 600px) {
    .title {
      font-size: 1.75rem;
      line-height: 1.2;
    }
  }
</style>
