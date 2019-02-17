<template>
  <div
    class="stack-container"
    :class="[mode]"
  >
    <div class="top-container">
      <span
        v-if="showEventName"
        class="tag light-font event-tag"
        @click="redirectEvent"
      >{{ eventName }}</span>
      <span
        v-if="isLatestStack"
        class="tag light-font"
      >
        最新进展
      </span>
      <span
        v-if="firstTime"
        class="tag light-font"
      >
        {{ firstTime }}
      </span>
      <br>
      <span
        v-if="stack.title"
        class="title"
      >
        {{ stack.title }}
      </span>
      <p
        v-if="stack.description"
        class="stack"
      >
        {{ stack.description }}
      </p>
    </div>
    <div class="news-list">
      <event-stack-news
        v-for="news of newsList"
        :key="news.id"
        :news="news"
      />
      <p
        v-if="moreToLoad"
        class="load-more"
        @click="loadMore"
      >
        <i
          v-if="!isNewsLoading"
          class="el-icon-refresh"
        />
        <i
          v-else
          class="el-icon-loading"
        />
        加载更多相关新闻
      </p>
    </div>
  </div>
</template>

<script>
import EventStackNews from '~/components/EventStack/EventStackNews.vue';
import getLocalTime from '~/utils/getLocalTime.js';

export default {
  name: 'EventStackContent',
  components: {
    'event-stack-news': EventStackNews,
  },
  props: {
    stack: Object,
    mode: String,
    showEventName: Boolean,
    isLatestStack: Boolean,
  },
  data() {
    return {
      newsList: [],
      isNewsLoading: false,
    };
  },
  computed: {
    event() {
      return this.$store.getters.getEvent(this.stack.event);
    },
    eventName() {
      return this.event ? this.event.name : null;
    },
    firstTime() {
      if (!this.stack || !this.stack.time) return;
      const time = getLocalTime(this.stack.time);
      return `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate() }日`;
    },
    route() {
      return this.$mockroute || this.$route;
    },
    router() {
      return this.$mockrouter || this.$router;
    },
    moreToLoad() {
      return this.stack && this.stack.newsCount > this.stack.news.length;
    },
  },
  created() {
    this.updateNewsList();
  },
  methods: {
    updateNewsList() {
      this.newsList = this.$store.getters.getNewsCollectionByStack({ stack: this.stack.id });
    },
    redirect() {
      this.router.push({
        name: 'event-stack',
        params: {
          name: this.stack.event,
          stack: this.stack.id,
        },
      });
      this.$emit('redirect');
    },
    redirectEvent() {
      this.router.push({
        name: 'event',
        params: { name: this.eventName },
      });
      this.$emit('redirect');
    },
    async loadMore() {
      if (!this.moreToLoad) return;
      this.isNewsLoading = true;
      try {
        const page = Math.floor(this.stack.news.length / 15) + 1;
        await this.$store.dispatch('getNewsList', {
          where: {
            stackId: this.stack.id,
            status: 'admitted',
          },
          page,
        });
        this.updateNewsList();
      } catch (err) {
        this.$message.error('加载失败，请稍后重试');
        console.error(err);
      } finally {
        this.isNewsLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "../../assets/variables.scss";

  .top-container {
    padding: .9rem 2rem 0 2rem;
    line-height: 1.5;
  }

  .news-list {
    margin-top: 12px;
  }

  a {
    color: black;
  }

  .tag {
    font-size: .9rem;
    margin-right: .5rem;
    text-decoration: none !important;
    border-bottom: .1rem solid transparent !important;
  }

  .event-tag {
    cursor: pointer;
  }

  .event-tag:hover {
    border-color: $light-color !important;
  }

  .title {
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 1.25;
    word-wrap: break-word;
  }

  p.stack {
    padding: .2rem 0 .5rem 0;
    line-height: 1.8 !important;
    font-size: 1rem !important;
    color: #333;
  }

  .stack-container:last-child {
    padding-bottom: 1rem;
  }

  .load-more {
    padding: 0 2rem;
    font-size: 14px;
    cursor: pointer;
  }

  br {
    line-height: 1;
  }

  @media (max-width: 600px) {
    .top-container {
      padding: 0;
    }

    .tag {
      margin-top: 0 !important;
    }

    .stack-container:last-child {
      padding-bottom: 0;
    }

    .load-more {
      padding: 0;
    }
  }
</style>
