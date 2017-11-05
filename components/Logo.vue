<template>
  <div class="icon-container">
    <div class="center">
      <nuxt-link to="/">
        <el-tooltip
          content="浪潮 - 渴望重回土地"
          class="large-screen"
          placement="right"
          effect="light"
        >
          <img class="" src="//s.langchao.co/icon.svg" height="54px">
        </el-tooltip>
        <img src="//s.langchao.co/icon.svg" class="small-screen" height="40px">
      </nuxt-link>
    </div>
  </div>
</template>

<style scoped>
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
    max-width: 46rem;
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .small-screen {
    display: none;
  }
  
  img {
    visibility: visible;
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
