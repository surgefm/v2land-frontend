<template>
  <card class="hover">
    <event-title>{{ detail.name }}</event-title>
    <event-status :time="time"></event-status>
    <event-description v-if="detail.description">
      {{ detail.description }}
    </event-description>
    <div class="event-share">
      <event-share :event="detail" />
    </div>
  </card>
</template>

<script>
  import EventTitle from '~/components/EventTitle.vue'
  import EventShare from '~/components/EventAbstractShare.vue'

  export default {
    components: {
      'event-title': EventTitle,
      'event-share': EventShare
    },
    props: {
      detail: Object
    },
    computed: {
      time () {
        let news = this.detail.newsCollection
        if (!news || news.length === 0) {
          return {}
        }

        let startTime = news[news.length - 1].time
        let lastTime = news[0].time

        return news.length === 1
          ? { startTime }
          : { startTime, lastTime }
      }
    }
  }
</script>

<style scoped>
  .event-share {
    display: flex;
    justify-content: flex-end;
  }
</style>
