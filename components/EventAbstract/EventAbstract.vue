<template>
  <card class="hover">
    <event-title>{{ detail.name }}</event-title>
    <event-status :time="time" />
    <event-description v-if="detail.description">
      {{ detail.description }}
    </event-description>
    <div class="event-share">
      <event-share
        :object="detail"
        type="event"
      />
    </div>
  </card>
</template>

<script>
  import EventShare from '~/components/EventShare.vue';
  import EventDescription from '~/components/EventAbstract/EventAbstractDescription.vue';
  import EventStatus from '~/components/EventAbstract/EventAbstractStatus.vue';

  export default {
    components: {
      'event-share': EventShare,
      'event-status': EventStatus,
      'event-description': EventDescription,
    },
    props: {
      detail: Object,
    },
    computed: {
      time() {
        const news = this.detail.news;
        if (!news || news.length === 0) {
          return {};
        }

        const startTime = news[news.length - 1].time;
        const lastTime = news[0].time;

        return news.length === 1
          ? { startTime }
          : { startTime, lastTime };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .event-share {
    display: flex;
    justify-content: flex-end;
  }

  .hover {
    padding-bottom: 1.25rem;
  }
</style>
