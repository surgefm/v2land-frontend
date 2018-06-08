<template>
  <div class="stack-container" :class="[mode]">
    <div class="top-container">
      <span
        class="tag light-font event-tag"
        v-if="showEventName"
        @click="redirectEvent"
      >{{ eventName }}</span>
      <span v-if="isLatestStack" class="tag light-font">
        最新进展
      </span>
      <p v-if="stack.title" class="title">
        {{ stack.title }}
      </p>
      <p v-if="stack.description" class="stack">
        {{ stack.description }}
      </p>
    </div>
    <el-button type="text" class="news-button" @click="toggleNewsButton">
      <i :class="showNews ? 'el-icon-caret-top' : 'el-icon-caret-right'" />
      {{ showNews ? '收起列表' : '3 条相关消息' }}
    </el-button>
    <div v-if="showNews" class="news-list">
      <event-stack-news
        v-for="news of newsList"
        :news="news"
        :key="news.id"
      />
    </div>
  </div>
</template>

<script>
  import EventStackNews from '~/components/EventStack/EventStackNews.vue';

  export default {
    name: 'EventStackContent',
    props: {
      stack: Object,
      mode: String,
      showEventName: Boolean,
      isLatestStack: Boolean,
    },
    data() {
      return {
        showNews: false,
      };
    },
    computed: {
      event() {
        return this.$store.getters.getEvent(this.stack.event);
      },
      eventName() {
        return this.event ? this.event.name : null;
      },
      newsList() {
        // return this.$store.getters.getNewsCollectionByStack;
        return [
          {
            title: '警方发现李白骑鲸鱼的时候并没有穿内内，场面十分吓人',
            abstract: '李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼李白骑鲸鱼',
            url: 'https://google.com',
            source: '新民晚报',
            time: '2018-05-26',
            event: 12,
          },
          {
            title: '123',
            abstract: '警方发现李白骑鲸鱼的时候并没有穿内内，场面十分吓人',
            url: 'https://google.com',
            source: '咕果',
            time: '2018-05-26',
            event: 12,
          },
          {
            title: '123',
            abstract: '321',
            url: 'https://google.com',
            source: '咕果',
            time: '2018-05-26',
            event: 12,
          },
        ];
      },
      route() {
        return this.$mockroute || this.$route;
      },
      router() {
        return this.$mockrouter || this.$router;
      },
    },
    components: {
      'event-stack-news': EventStackNews,
    },
    methods: {
      toggleNewsButton() {
        this.showNews = !this.showNews;
      },
      redirect() {
        this.router.push({
          name: 'event-pinyin-stack',
          params: {
            name: this.stack.event,
            stack: this.stack.id,
            pinyin: this.event ? this.event.pinyin : null,
          },
        });
        this.$emit('redirect');
      },
      redirectEvent() {
        this.router.push({
          name: 'event-pinyin',
          params: {
            name: this.eventName,
            pinyin: this.event ? this.event.pinyin : null,
          },
        });
        this.$emit('redirect');
      },
    },
    created() {
      if (this.isLatestStack) {
        this.showNews = true;
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/variables.scss";

  .top-container {
    padding: .9rem 2rem 0 2rem;
    line-height: 1.5;
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

  .news-button {
    margin-left: 1.5rem;
  }

  .stack-container:last-child {
    padding-bottom: 1rem;
  }
</style>
