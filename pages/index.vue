<template>
  <div class="homepage-container">
    <card class="title-container hover">
      <div class="img-background header-image" />
      <img
        v-lazy="config.static + '560x144/default.jpg'"
        onload="this.id = 'show'"
        class="header-image"
      />
      <logotype color="#333" />
      <event-description class="title-description light-font">
        你的社会事件追踪工具
      </event-description>
      <div class="title-button-container">
        <nuxt-link to="/new">
          <el-button
            class="title-button"
            v-analytics="{ action: 'buttonClick', label: 'postEvent' }"
          >
            创建事件
          </el-button>
        </nuxt-link>
        <nuxt-link to="/about">
          <el-button
            class="title-button"
            type="primary"
            v-analytics="{ action: 'buttonClick', label: 'aboutV2land' }"
          >
            了解浪潮
          </el-button>
        </nuxt-link>
      </div>
    </card>
    <event-card
      v-if="!showLoader"
      v-for="event of eventList"
      :key="event.id"
      :event="event"
      :fade="true"
    />
    <event-card-shimmer
      v-if="showLoader"
      v-for="(index) of new Array(3)"
      :key="index"
    />
    <load-more v-if="!showLoader" :type="'event'">加载更多</load-more>
    <page-foot class="page-foot" />
  </div>
</template>

<script>
  import config from '~/const';
  import EventCard from '~/components/EventCard/EventCard.vue';
  import EventCardShimmer from '~/components/EventCard/EventCardShimmer.vue';
  import EventDescription from '~/components/EventAbstract/EventAbstractDescription.vue';
  import LoadMore from '~/components/LoadMore.vue';

  export default {
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
    methods: {
      async init() {
        if (!this.$store.getters.isFirstPage) {
          this.showLoader = true;
          await this.$store.dispatch('fetchEventList');
          this.showLoader = false;
        }
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
    components: {
      'event-card': EventCard,
      'event-card-shimmer': EventCardShimmer,
      'event-description': EventDescription,
      'load-more': LoadMore,
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
    display: block;
    position: relative;
    padding: 10.5rem 1.5rem .5rem 1.5rem !important;
  }

  .title-container .header-image {
    width: 100%;
    height: 9rem;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
  }

  .title-description {
    margin-top: 0 !important;
  }

  .title-button-container {
    display: flex;
    justify-content: flex-end;
  }

  .title-button {
    margin: .5rem 0 1rem .5rem;
  }

  @media (max-width: 600px) {
    .homepage-container {
      padding: 4rem 1rem 1rem 1rem;
    }
  }
</style>
