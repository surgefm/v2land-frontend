<template>
  <card class="card">
    <div class="event-container">
      <div class="event-text event-text-image">
        <div class="event-image-container img-background">
          <div class="event-image event-image-shimmer shimmer"></div>
        </div>
        <div class="description event-description light-font limit">
          <div class="title-shimmer shimmer"></div>
          <div class="line-shimmer shimmer"></div>
          <div class="line-shimmer shimmer"></div>
          <div class="line-shimmer shimmer"></div>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
</script>

<style lang="scss" scoped>
  .card {
    padding: 0 !important;
    cursor: pointer;
  }

  .event-container {
    display: flex;
  }

  .event-text {
    width: 100%;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    height: 240px;
  }

  .event-text-image {
    padding-right: 13.5rem;
  }

  .event-title {
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 1.5;
    color: black;
  }

  .event-description {
    margin-top: .5rem;
  }

  .event-description.limit {
    max-height: 7.2rem;
  }

  .event-image-container {
    width: 12rem;
    height: 100%;
    margin: 0;
    background-size: cover;
    background-position: center;
    position: absolute;
    right: 0;
    top: 0;
  }

  .event-image {
    object-fit: cover;
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;
    width: 100%;
    height: 100%;
  }

  .event-image-container span {
    position: absolute;
    right: .25rem;
    bottom: .25rem;
    font-size: .75rem;
    padding: .35rem;
    background-color: #333;
    color: #fff;
    line-height: 1;
    border-radius: .25rem;
    user-select: none;
  }

  p {
    text-decoration: none;
    color: black;
  }

  @media (max-width: 600px) {
    .event-text {
      padding-right: 1.5rem;
    }

    .event-text-image {
      padding: .5rem;
    }

    .event-text-image p {
      margin: 1rem .5rem 0 1rem;
    }

    .event-text-image .description {
      margin: .5rem 1rem 1rem 1rem;
    }

    .event-description.limit {
      max-height: 9rem;
    }

    .event-image-container {
      width: 102px;
      height: 102px;
      margin-left: 1rem;
      position: relative;
      float: right;
      border-radius: .25rem;
      top: .5rem;
      right: .5rem;
    }

    .event-image-container span {
      border-top-right-radius: 0;
      border-bottom-left-radius: 0;
      right: 0;
      bottom: 0;
      padding: .25rem;
    }

    .event-image {
      height: 100%;
      border-radius: .25rem;
    }

  }

  .title-shimmer {
    height: 1.5rem;
    width: 10rem;
  }

  .event-image-shimmer {
    width: 240px;
    height: 240px;
  }

  .line-shimmer {
    height: 1rem;
    margin-top: .8rem;
    margin-bottom: .8rem;
    width: 100%;
  }

  .shimmer {
    animation-duration: 0.8s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: shimmer-ani;
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

  @keyframes shimmer-ani {
    0%,
    100% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.45;
    }
  }
</style>
