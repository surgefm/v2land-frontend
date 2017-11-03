<template>
  <background>
    <first-screen :background="{ imageUrl: 'default.jpg' }" />
    <div class="homepage-container">
      <div class="event-container">
        <event-card
          v-for="event of eventCollection"
          :key="event.id"
          :event="event"
        />
      </div>
      <page-foot/>
    </div>
    <logo class="logo"></logo>
  </background>
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
    position: absolute;
    top: 40vh;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .event-container {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }
</style>
