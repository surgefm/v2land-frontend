<template>
  <div
    class="card background-color"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>

<script>
export default { name: 'Card' };
</script>

<style lang="scss" scoped>
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
    box-shadow: 0 10px 40px rgba(0,0,0,.075), 0 2.5px 10px rgba(0,0,0,.0375);
  }

  @media (max-width: 600px) {
    .card {
      padding: .75rem 1rem;
      box-shadow: 0 5px 5px rgba(0,0,0,.025) !important;
    }
  }
</style>
