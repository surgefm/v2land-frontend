<template>
  <img v-if="mode === 'simple'" :src="src" onload="this.id='show'" />
  <div v-else class="icon-container">
    <div class="center">
      <nuxt-link to="/">
        <el-tooltip
          content="浪潮 - 渴望重回土地"
          class="large-screen"
          placement="right"
          effect="light"
        >
          <img :src="src" height="54px" />
        </el-tooltip>
        <img :src="src" height="40px" class="small-screen" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import config from '~/const'

export default {
  props: {
    'mode': String
  },
  computed: {
    src () {
      return config.static + 'icon.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
  .icon-container {
    display: flex;
    justify-content: center;
    padding: .5rem;
    width: 100%;
    visibility: hidden;
  }

  .icon-container .exact-active-link {
    background-color: transparent;
    box-shadow: none;
  }

  .center {
    max-width: 48rem;
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .small-screen {
    display: none;
  }
  
  img {
    visibility: visible;
    opacity: 1 !important;
  }

  @media (max-width: 600px) {
    .small-screen {
      display: block;
    }

    .large-screen {
      display: none;
    }

    .icon-container {
      width: auto;
    }
  }
</style>
