<template>
  <card class="news-wrapper">
    <div class="event-line-loader loader-bar"></div>
    <div class="event-line-loader loader-bar"></div>
    <div class="event-line-loader loader-bar"></div>
  </card>
</template>

<style lang="scss" scoped>

  .news-wrapper {
    position: relative;
    padding: 1rem 2rem;
    background: rgba(0, 0, 0, 0);
  }

  .card:hover {
    box-shadow: 0 0px 0px;
  }

  .event-title-loader {
    height: 2rem;
    width: 100%;
    margin-bottom: .25rem;
    margin-top: .25rem;
  }

  .event-line-loader{
    height: 0.8rem;
    margin-top: 1.4rem;
    margin-bottom: 1.4rem;
    width: 100%;
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
