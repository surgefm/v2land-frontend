<template>
  <card class="hover event-abstract-loader">
    <div class="event-title-loader loader-bar" />
    <div>
      <div
        v-for="(index) of new Array(4)"
        :key="index"
        class="event-line-loader loader-bar"
      />
    </div>
    <div class="event-action-loader">
      <div class="loader-bar" />
    </div>
  </card>
</template>

<style lang="scss" scoped>
  .hover {
    padding-bottom: 1.25rem;
  }

  .event-title-loader {
    height: 2rem;
    max-width: 18rem;
    width: 100%;
    margin-bottom: .25rem;
    margin-top: .25rem;
  }

  .event-line-loader {
    height: 1.2rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 100%;
  }

  .event-line-loader:last-child {
    width: 70%;
  }

  .event-action-loader {
    display: flex;
    justify-content: flex-end;
  }

  .event-action-loader .loader-bar {
    width: 16rem;
    height: 1.2rem;
    margin-bottom: .5rem;
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
