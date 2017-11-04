<template>
  <div class="icon-container">
    <nuxt-link to="/">
      <el-tooltip
        content="浪潮 - 渴望重回土地"
        class="large-screen"
        placement="right"
        effect="light"
      >
        <img src="/icon.png" height="64px">
      </el-tooltip>
      <img src="/icon.png" class="small-screen" height="40px">
    </nuxt-link>
  </div>
</template>

<style scoped>
  .icon-container {
    display: flex;
    align-items: center;
    padding: .5rem;
  }

  .icon-container .exact-active-link {
    background-color: transparent;
  }

  .small-screen {
    display: none;
  }

  @media (max-width: 600px) {
    .small-screen {
      display: block;
    }

    .large-screen {
      display: none;
    }
  }
</style>
