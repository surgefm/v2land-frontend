<template>
  <card class="hover event-abstract-loader">
    <div class="event-title-loader loader-bar"></div>
    <div class="event-line-loader loader-bar"></div>
    <div class="event-line-loader loader-bar"></div>
    <div class="event-line-loader loader-bar"></div>
  </card>
</template>

<style lang="scss" scoped>
  .hover {
    padding-bottom: 1.25rem;
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

  .event-abstract-loader {
    width: 35rem;
  }

  .event-title-loader {
    height: 2.2rem;
    width: 100%;
    margin-bottom: .25rem;
    margin-top: .25rem;
  }

  .event-status-loader {
    height: 18px;
    margin-top: .25rem;
    width: 35%;
  }

  .event-line-loader{
    height: 0.8rem;
    margin-top: 1.4rem;
    margin-bottom: 1.4rem;
    width: 100%;
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
