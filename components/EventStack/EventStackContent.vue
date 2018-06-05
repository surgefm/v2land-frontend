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
      <a v-if="stack.title" class="title">
        {{ stack.title }}
      </a>
    </div>
    <p v-if="stack.description" class="stack">
      {{ stack.description }}
    </p>
    <div v-if="showNews">
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
      isLatestStack() {
        return this.order === this.event.stackCount - 1 && !this.showEventName;
      },
      newsList() {
        // return this.$store.getters.getNewsCollectionByStack;
        return [
          {
            title: '123',
            abstract: '321',
            url: 'https://google.com',
            source: '咕果',
          },
          {
            title: '123',
            abstract: '321',
            url: 'https://google.com',
            source: '咕果',
          },
          {
            title: '123',
            abstract: '321',
            url: 'https://google.com',
            source: '咕果',
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

  a {
    color: black;
  }

  a:hover:not(.link) {
    border-bottom: .125rem #000 solid;
    padding-bottom: .05rem;
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

  .stack {
    padding-top: .5rem;
    line-height: 1.8 !important;
    font-size: 1rem !important;
    color: #333;
  }
</style>
