<template>
  <div class="homepage-container">
    <div class="background-image" />
    <div class="event-container">
      <event-card
        v-for="event of eventCollection"
        :key="event.id"
        :event="event"
      />
      <event-card
        v-for="event of eventCollection"
        :key="event.id"
        :event="event"
      />
      <event-card
        v-for="event of eventCollection"
        :key="event.id"
        :event="event"
      />
      <event-card
        v-for="event of eventCollection"
        :key="event.id"
        :event="event"
      />
    </div>
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
  }

  .background-image {
    position: fixed;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.0),
      rgba(0, 0, 0, 0.0) 50%, rgba(0, 0, 0, 1)),
      url(https://s.langchao.co/default.jpg);
  }

  .event-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 7rem 1rem;
  }
</style>
