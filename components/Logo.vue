<template>
  <div class="icon-container">
    <nuxt-link to="/">
      <el-tooltip content="浪潮 - 渴望重回土地" placement="right" effect="light">
        <img src="/icon.png" height="64px">
      </el-tooltip>
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

  @media (max-width: 600px) {
    img {
      height: 40px;
    }
  }
</style>
