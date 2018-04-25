<template>
  <card class="news-wrapper">
    <div class="news-title-loader loader-bar" />
    <div
      v-for="(index) of new Array(3)"
      :key="index"
      class="news-line-loader loader-bar"
    />
  </card>
</template>

<style lang="scss" scoped>
  .news-wrapper {
    position: relative;
    padding: 1rem 2rem;
  }

  .card:hover {
    box-shadow: 0 0px 0px;
  }

  .news-title-loader {
    height: 1.5rem;
    width: 100%;
    max-width: 18rem;
    margin-bottom: .25rem;
    margin-top: .25rem;
  }

  .news-line-loader{
    height: 1rem;
    margin-top: .8rem;
    margin-bottom: .8rem;
    width: 100%;
  }

  .news-line-loader:last-child {
    width: 70%;
    margin-bottom: .5rem;
  }

  .loader-bar-placeholder {
    height: 2rem;
  }

  .loader-bar {
    animation-duration: 0.8s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: loader-bar-ani;
    animation-timing-function: linear;
    background: linear-gradient(
      90deg,
      rgb(241, 241, 241) 0,
      rgb(247, 249, 250) 10%,
      rgb(210, 210, 210) 40%,
      rgb(223, 223, 223) 73%,
      #f7f9fa 100%
    );
  }

  @keyframes loader-bar-ani {
    0%,
    100% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.45;
    }
  }
</style>
