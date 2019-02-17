<template>
  <card class="hover">
    <event-title>{{ detail.name }}</event-title>
    <event-status :event="detail" />
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

  @media (max-width: 600px) {
    .hover {
      padding-top: 1rem !important;
    }
  }
</style>
