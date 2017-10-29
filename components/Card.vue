<template>
  <div class="card background-color">
    <slot></slot>
  </div>
</template>

<style scoped>
  .card {
    max-width: 35rem;
    width: 100%;
    display: block;
    padding: 1.5rem 2rem 1.5rem 2rem;
    margin-bottom: 1.25rem;
    z-index: 1000;
  }
</style>
