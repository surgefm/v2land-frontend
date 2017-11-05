<template>
  <card class="card">
    <nuxt-link :to="'/' + event.name" class="link">
      <div class="event-container">
        <div :class="['event-text', !event.image || 'event-text-image']">
          <p class="event-title">
            {{ event.name }}
          </p>
          <event-description class="event-description">
            {{ description }}
          </event-description>
        </div>
        <div
          class="event-image-container"
          v-if="event.image"
          :style="`background-image:url(${image})`"
        />
      </div>
    </nuxt-link>
  </card>
</template>

<script>
  import config from '~/const'

  export default {
    props: {
      event: Object
    },
    computed: {
      description () {
        let text = this.event.description.slice(0, 60)
        if (this.event.description.length > 60) {
          text += '……'
        }
        return text
      },
      image () {
        return config.static + '240x240/' + this.event.image.imageUrl
      }
    }
  }
</script>

<style scoped>
  .card {
    padding: 0 !important;
  }

  .event-container {
    display: flex;
  }

  .event-text {
    width: 100%;
    padding: 1.5rem;
  }

  .event-text-image {
    width: calc(100% - 12rem);
  }

  .event-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.5;
  }

  .event-description {
    margin-top: .5rem;
  }

  .event-image-container {
    width: 12rem;
    margin: 0;
    background-size: cover;
    background-position: center;
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;
  }

  p {
    text-decoration: none;
    color: black;
  }

  @media (max-width: 600px) {
    .event-text-image {
      width: 100%;
    }

    .event-image-container {
      display: none;
    }
  }
</style>
