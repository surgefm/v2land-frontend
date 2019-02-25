<template>
  <div class="homepage-container">
    <div class="title-container">
      <logotype
        color="#333"
        class="large"
      />
      <logotype
        color="#333"
        :height="32"
        class="small"
      />
    </div>
    <div
      v-if="!showLoader"
      class="card-container"
    >
      <event-card
        v-for="event of eventList"
        :key="event.id"
        :event="event"
        :fade="true"
      />
      <load-more :type="'event'">
        加载更多
      </load-more>
    </div>
    <div
      v-else
      class="card-container"
    >
      <event-card-shimmer
        v-for="(index) of new Array(5)"
        :key="index"
      />
    </div>
    <page-foot class="page-foot" />
  </div>
</template>

<script>
import config from '~/const';
import EventCard from '~/components/EventCard/EventCard.vue';
import EventCardShimmer from '~/components/EventCard/EventCardShimmer.vue';
import LoadMore from '~/components/LoadMore.vue';

export default {
  components: {
    'event-card': EventCard,
    'event-card-shimmer': EventCardShimmer,
    'load-more': LoadMore,
  },
  data() {
    return {
      eventCollection: [],
      config,
      showLoader: false,
    };
  },
  computed: {
    eventList() {
      return this.$store.getters.getEventList(((e) => e.status === 'admitted')) || [];
    },
  },
  async asyncData({ store }) {
    if (store.getters.isServer) {
      await store.dispatch('fetchEventList');
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (!this.$store.getters.isFirstPage) {
        this.showLoader = true;
        await this.$store.dispatch('fetchEventList');
        this.showLoader = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .homepage-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 7rem 1rem 1rem 1rem;
  }

  .title-container {
    position: absolute;
    top: 2.6rem;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    max-width: 35rem;
    width: 100%;
  }

  .small {
    display: none;
  }

  .card-container {
    max-width: 35rem;
    width: 100%;
  }

  @media (max-width: 600px) {
    .homepage-container {
      padding: 6rem 1rem 1rem 1rem;
    }

    .large {
      display: none;
    }

    .small {
      display: block;
    }

    .title-container {
      top: 3rem;
      padding: 0 1rem;
    }
  }
</style>
