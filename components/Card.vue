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
    padding: 1.5rem 2rem;
    margin-bottom: 1.25rem;
    border-radius: .5rem;
    z-index: 1000;
    box-shadow: none;
    transition: all .2s;
  }

  .card:hover {
    box-shadow: 0 20px 80px rgba(0,0,0,.1), 0 5px 20px rgba(0,0,0,.05);
  }

  @media (max-width: 600px) {
    .card {
      padding: 1.5rem 1rem;
    }
  }
</style>
