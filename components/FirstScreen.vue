<template>
  <div style="width: 100%" class="overall">
    <div v-if="background && background.imageUrl" class="first-screen-container">
      <div 
        class="background"
        :style="'background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.0), \
          rgba(0, 0, 0, 0.0) 50%, rgba(0, 0, 0, 1)), url(' +
          backgroundUrl + ')'"
      />
      
      <div v-if="background && background.imageUrl" class="header">
        <slot name="header" />
      </div>
    </div>

    <div v-else class="blank-top">
      <slot name="header" />
    </div>
  </div>
  
</template>

<script>
  import config from '~/const'

  export default {
    props: {
      background: Object
    },
    computed: {
      backgroundUrl () {
        return config.static + this.background.imageUrl
      }
    }
  }
</script>

<style lang="scss" scoped>
  .first-screen-container {
    min-height: 100vh;
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
    padding: 4rem 0 0 0;
  }

  .blank-top {
    padding-top: 6rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 600px) {
    .overall {
      margin-bottom: 2.5rem;
    }

    .header {
      position: relative;
    }
  }
</style>