<template>
  <card
    class="load-more"
    v-if="isMoreAvailable"
    @click="loadMethod"
  >
    <span>
      <slot />
      <i :class="loading ? 'el-icon-loading' : 'el-icon-refresh'" />
    </span>
  </card>
  <div v-else class="ending-wrapper">
    <div class="ending">
      <div class="bar" />
      <span v-if="type === 'event'">你已加载所有事件</span>
      <span v-else>事件自此发端</span>
      <div class="bar" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 2,
      loading: false,
      loadFlag: true,
    };
  },
  props: {
    event: Object,
    type: String,
  },
  computed: {
    routeEvent() {
      if (this.$route.params.name) {
        return this.$store.getters.getEvent(this.$route.params.name);
      }

      return false;
    },
    isMoreAvailable() {
      if (this.type !== 'news') return this.loadFlag;
      if (!this.loadFlag) return false;

      let event = this.event;
      if (!event && this.routeEvent) {
        event = this.routeEvent;
      }
      if (!event) return false;
      if ((event.news || []).length < 15) return false;
      if (!event.newsCount) return true;
      return (event.news || []).length === event.newsCount;
    },
  },
  methods: {
    loadMethod() {
      if (this.type === 'news') {
        this.loadNews();
      } else if (this.type === 'event') {
        this.loadEvent();
      }
    },
    async loadNews() {
      this.loading = true;
      const newsList = await this.$store.dispatch('getNewsList', {
        where: {
          event: (this.event || this.routeEvent).id,
          status: 'admitted',
        },
        page: this.page,
      });
      this.loading = false;
      if (newsList.length > 0) {
        await this.$store.dispatch('addNewList', newsList);
        this.page++;
      } else {
        this.$message.success('你已加载全部新闻');
        this.loadFlag = false;
      }
    },
    async loadEvent() {
      this.loading = true;
      const moreEvents = await this.$store.dispatch('getEventList', {
        page: this.page,
      });
      this.loading = false;
      if (moreEvents.length > 0) {
        this.page++;
      } else {
        this.loadFlag = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .load-more {
    padding: 0.5rem 2rem;
    text-align: center;
    cursor: pointer;
  }

  .load-more i {
    margin-left: .35rem;
  }

  .ending-wrapper {
    width: 100%;
    margin-bottom: 1rem;
  }

  .ending {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ending span {
    color: #606266;
    line-height: 1;
    font-size: .9rem;
  }

  .bar {
    width: 4rem;
    height: 1.5px;
    background-color: #c0c4cc;
  }

  .bar:first-child {
    margin-right: .5rem;
  }

  .bar:last-child {
    margin-left: .5rem;
  }
</style>
