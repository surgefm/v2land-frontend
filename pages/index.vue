<template>
  <div class="homepage-container">
    <card class="title-container">
      <event-title>浪潮</event-title>
      <event-description class="title-description">社会事件追踪工具</event-description>
      <nuxt-link to="/about">
        <el-button class="title-button">了解浪潮</el-button>
      </nuxt-link>
    </card>
    <event-card
      v-for="event of eventCollection"
      :key="event.id"
      :event="event"
    />
    <page-foot class="page-foot" />
    <logo class="logo"></logo>
  </div>
</template>

<script>
  import EventCard from '~/components/EventCard.vue'

  export default {
    data () {
      return {
        eventCollection: []
      }
    },
    components: {
      'event-card': EventCard
    },
    async asyncData ({ store }) {
      return {
        eventCollection: await store.dispatch('getEventList')
      }
    }
  }
</script>

<style scoped>
  .homepage-container {
    width: 100%;
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 7rem 1rem;
  }

  .title-container {
    display: block;
    padding: 0 1rem !important;
  }

  .title-description {
    margin-top: 0 !important;
  }

  .title-button {
    margin: .5rem 0 1rem 0;
  }

  @media (max-width: 600px) {
    .homepage-container {
      padding: 5rem 1rem;
    }
  }
</style>
