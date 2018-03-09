<template>
  <card class="card">
    <a
      :href="'/' + event.name"
      :pageReady="pageReady ? 1 : 0"
      onclick="javascript:return this.attributes.pageready.value == 0"
      @click="cardClicked"
      class="link"
      v-if="!isAdminEvent"
    >
      <div class="event-container">
        <div :class="['event-text', !event.headerImage || 'event-text-image']">
          <div class="event-image-container" v-if="event.headerImage">
            <img
              class="event-image"
              :src="image"
              onload="this.id='show'"
            />
            <span @click="openImageSource(event.headerImage.sourceUrl)">
              {{ event.headerImage.source }}
            </span>
          </div>
          <p class="event-title">
            {{ event.name }}
          </p>
          <event-description class="event-description light-font">
            {{ description }}
          </event-description>
        </div>
      </div>
    </a>
    <div v-else class="event-container">
      <div class="event-text">
        <nuxt-link class="event-title" :to="'/' + event.name">
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
  import config from '~/const';
  import EventCardAction from '~/components/EventCard/EventCardAction.vue';

  export default {
    props: {
      event: Object,
    },
    data() {
      return {
        imageClicked: false,
        pageReady: false,
      };
    },
    computed: {
      description() {
        if (this.isAdminEvent) {
          return this.event.description;
        } else {
          let text = this.event.description.slice(0, 60);
          if (this.event.description.length > 60) {
            text += '……';
          }
          return text;
        }
      },
      image() {
        return config.static + '240x240/' + this.event.headerImage.imageUrl;
      },
      isAdminEvent() {
        return this.$route.name === 'admin-event';
      },
    },
    methods: {
      cardClicked() {
        if (!this.imageClicked) {
          return this.$router.push('/' + this.event.name);
        }

        this.imageClicked = false;
      },
      openImageSource(url) {
        this.imageClicked = true;
        if (url) {
          window.open(url, '_blank');
        }
      },
    },
    mounted() {
      this.pageReady = 1;
    },
    components: {
      'event-card-action': EventCardAction,
    },
  };
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
  }

  .event-text-image {
    padding-right: 13.5rem;
    position: relative;
    overflow: hidden;
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
    opacity: 0;
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

    .event-image-container {
      width: 102px;
      height: 102px;
      margin-left: .5rem;
      position: relative;
      float: right;
      border-radius: .25rem;
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
</style>
