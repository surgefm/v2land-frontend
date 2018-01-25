<template>
  <card class="card hover">
    <nuxt-link :to="'/' + event.name" class="link" v-if="!isAdminEvent">
      <div class="event-container">
        <div :class="['event-text', !event.image || 'event-text-image']">
          <p class="event-title">
            {{ event.name }}
          </p>
          <event-description class="event-description">
            {{ description }}
          </event-description>
          <img
            class="event-image-container"
            v-if="event.image"
            :src="image"
            onload="this.id='show'"
          />
        </div>
      </div>
    </nuxt-link>
    <div v-else class="event-container">
      <div class="event-text">
        <nuxt-link class="event-title link" :to="'/' + event.name">
          {{ event.name }}
        </nuxt-link>
        <event-description class="event-description">
          {{ description }}
        </event-description>
        <event-card-action :event="event" v-on:update="$emit('update')" />
      </div>
    </div>
  </card>
</template>

<script>
  import config from '~/const'
  import EventCardAction from '~/components/EventCardAction.vue'

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
      },
      isAdminEvent () {
        return this.$route.path === '/admin/event'
      }
    },
    components: {
      'event-card-action': EventCardAction
    }
  }
</script>

<style lang="scss" scoped>
  .card {
    padding: 0 !important;
  }

  .link {
    color: black;
  }

  .event-container {
    display: flex;
  }

  .event-text {
    width: 100%;
    padding: 1.5rem;
  }

  .event-text-image {
    padding-right: 13.5rem;
    position: relative;
  }

  .event-title {
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 1.5;
  }

  .event-description {
    margin-top: .5rem;
  }

  .event-image-container {
    width: 12rem;
    height: 100%;
    margin: 0;
    background-size: cover;
    background-position: center;
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0;
  }

  p {
    text-decoration: none;
    color: black;
  }

  @media (max-width: 600px) {
    .event-text {
      padding-right: 1.5rem;
    }

    .event-image-container {
      display: none;
    }
  }
</style>
