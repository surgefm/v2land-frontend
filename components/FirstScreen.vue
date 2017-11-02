<template>
  <div style="width: 100%">
    <div v-if="background && background.imageUrl" class="first-screen-container">
      <div 
        class="background"
        :style="'background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.0), \
          rgba(0, 0, 0, 0.0) 50%, rgba(0, 0, 0, 1)), url(' +
          background.imageUrl + ')'"
      >
      </div>
      
      <div v-if="background && background.imageUrl" class="header">
        <slot name="header"></slot>
      </div>
    </div>

    <div v-else class="blank-top">
      <slot name="header"></slot>
    </div>
  </div>
  
</template>

<script>
  export default {
    props: {
      background: Object
    }
  }
</script>

<style scoped>
  .first-screen-container {
    height: 100vh;
    width: 100%;
  }

  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
  }

  .header {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -3.5rem;
    display: flex;
    justify-content: center;
  }

  .blank-top {
    padding-top: 6rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>