<template>
  <img v-if="mode === 'simple'" :src="src" onload="this.id='show'" />
  <div v-else class="icon-container">
    <div class="center">
      <!--
        If we don't write in this way, large-touch-screen users would have to
        click twice on the icon to get redirected.
      -->
      <div class="large-screen">
        <el-tooltip
          content="浪潮 - 渴望重回土地"
          placement="right"
          effect="light"
          :manual="true"
          :value="showTooltip"
          :visible-arrow="false"
        >
          <div class="large-screen-touch" />
        </el-tooltip>
        <img
          class="large-screen-touch"
          :src="src"
          height="54px"
          @click="$router.push('/')"
          @mouseover="showTooltip = touch ? false : true"
          @mouseleave="showTooltip = false"
          @touchstart="touched"
        />
      </div>
      <img @click="$router.push('/')" :src="src" height="40px" class="small-screen" />
    </div>
  </div>
</template>

<script>
import config from '~/const'

export default {
  props: {
    'mode': String
  },
  data () {
    return {
      showTooltip: false,
      touch: false
    }
  },
  computed: {
    src () {
      return config.static + 'icon.svg'
    },
    isHomepage () {
      return this.$route.name === 'index'
    }
  },
  methods: {
    touched () {
      this.showTooltip = this.isHomepage ? !this.showTooltip : false
      this.touch = !this.isHomepage
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

  .large-screen {
    position: relative;
  }

  .large-screen-touch {
    visibility: visible;
    width: 51.25px;
    height: 54px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .small-screen {
    display: none;
  }
  
  img {
    visibility: visible;
    cursor: pointer;
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
