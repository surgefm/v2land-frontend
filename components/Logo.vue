<template>
  <img v-if="mode === 'simple'" src="~/static/icon.svg" onload="this.id='show'" />
  <div v-else class="icon-container">
    <div class="center">
      <!--
        If we don't write in this way, large-touch-screen users would have to
        click twice on the icon to get redirected.
      -->
      <div class="icon-large-screen">
        <el-tooltip
          content="浪潮 - 渴望重回土地"
          placement="right"
          effect="light"
          :manual="true"
          :value="showTooltip"
        >
          <div class="large-screen-touch" />
        </el-tooltip>
        <img
          class="large-screen-touch"
          :src="src('icon-beta.svg')"
          height="54px"
          @click="$router.push('/')"
          @mouseover="showTooltip = touch ? false : true"
          @mouseleave="showTooltip = false"
          @touchstart="touched"
        />
      </div>
      <img
        @click="$router.push('/')"
        :src="src('icon-beta-small.svg')"
        height="40px"
        class="icon-small-screen"
      />
    </div>
  </div>
</template>

<script>
import config from '~/const';

export default {
  props: {
    'mode': String,
  },
  data() {
    return {
      showTooltip: false,
      touch: false,
    };
  },
  computed: {
    isHomepage() {
      return this.$route.name === 'index';
    },
  },
  methods: {
    src(dir) {
      return config.cdn + dir;
    },
    touched() {
      this.showTooltip = this.isHomepage ? !this.showTooltip : false;
      this.touch = !this.isHomepage;
    },
  },
};
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

  .icon-large-screen {
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

  .icon-small-screen {
    display: none;
  }
  
  img {
    visibility: visible;
    cursor: pointer;
    opacity: 1 !important;
  }

  @media (max-width: 600px) {
    .icon-small-screen {
      display: block;
    }

    .icon-large-screen{
      display: none;
    }

    .icon-container {
      width: auto;
    }
  }
</style>
