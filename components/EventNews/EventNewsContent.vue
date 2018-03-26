<template>
  <div class="news-container" :class="[mode]">
    <div class="top-container">
      <span
        class="tag light-font event-tag"
        v-if="showEventName"
        @click="redirectEvent"
      >{{ eventName }}</span>
      <span v-if="order === 1 && !showEventName" class="tag light-font">
        最新消息
      </span>
      <span v-if="news.tag" class="tag light-font">
        {{ news.tag }}
      </span>
      <span v-if="news.source" class="source light-font">
        {{ news.source }}
      </span>
      <br v-if="news.source || news.tag">
      <a
        v-if="news.title"
        :href="href"
        target="_blank" class="title"
      >
        {{ news.title }}
      </a>
    </div>
    <p v-if="news.abstract" class="news">
      {{ news.abstract }}
    </p>
    <comment-viewer
      v-if="news.comment"
      :input="news.comment"
      mode="remark"
      class="comment-viewer"
    />
    <div class="bottom">
      <span class="bottom-date">
        {{ getString(news.time) }}
      </span>
      <event-news-admit
        class="news-share"
        v-if="mode === 'admit'"
        :news="news"
        v-on:admitted="$emit('admitted')"
        v-on:rejected="$emit('rejected')"
      />

      <a
        v-else-if="mode === 'quote'"
        :href="`/${news.event.id || news.event}?news=${news.id}`"
        onclick="return false;"
        class="link"
      >
        <el-button type="primary" size="medium" @click="redirect">
          前往新闻
        </el-button>
      </a>
        
      <event-news-share
        v-else
        class="news-share"
        :object="news"
        type="news"
      />
    </div>
  </div>
</template>

<script>
  import EventNewsAdmit from '~/components/EventNews/EventNewsAdmit.vue';
  import EventNewsShare from '~/components/EventShare.vue';
  import CommentViewer from '~/components/Comment/Viewer.vue';

  export default {
    name: 'EventNewsContent',
    props: {
      news: Object,
      order: Number,
      mode: String,
      event: Object,
    },
    data() {
      return {
        eventName: this.event ? this.event.name : '',
      };
    },
    computed: {
      showEventName() {
        if (this.news.event === this.route.params.name ||
          (this.event && this.news.event === this.event.id)) {
          return false;
        }

        if (this.event) return true;

        const event = this.$store.getters.getEvent(this.news.event);
        if (event) {
          this.eventName = event.name;
          return true;
        }

        return false;
      },
      href() {
        return '/redirect.html?to=' + encodeURIComponent(this.news.url);
      },
      route() {
        return this.$mockroute || this.$route;
      },
      router() {
        return this.$mockrouter || this.$router;
      },
    },
    components: {
      'event-news-admit': EventNewsAdmit,
      'event-news-share': EventNewsShare,
      'comment-viewer': CommentViewer,
    },
    methods: {
      getString(input) {
        const date = new Date(input);
        if (isNaN(date.getTime())) {
          return '';
        }

        let string = '';
        string += date.getFullYear() + ' 年 ';
        string += (date.getMonth() + 1) + ' 月 ';
        string += date.getDate() + ' 日';

        return string;
      },
      redirect() {
        this.router.push({
          name: 'name',
          params: { name: this.eventName },
          query: { news: this.news.id },
        });
        this.$emit('redirect');
      },
      redirectEvent() {
        this.router.push({
          name: 'name',
          params: { name: this.eventName },
        });
        this.$emit('redirect');
      },
    },
    async created() {
      const eventId = this.news.event.id || this.news.event;
      this.eventName = (await this.$store.dispatch('getEvent', eventId)).name;
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

  .source {
    font-size: .9rem;
  }

  .title {
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 1.25;
    word-wrap: break-word;
  }

  .news {
    padding-top: .5rem;
    line-height: 1.8 !important;
    font-size: 1rem !important;
    color: #333;
  }

  .comment-viewer {
    padding-top: .25rem;
  }

  .bottom {
    margin-top: .5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .bottom-date {
    font-size: .9rem;
    color: #888;
    font-weight: 500;
    padding-bottom: .25rem;
  }

  @media (max-width: 600px) {
    .bottom {
      flex-direction: column;
      align-items: flex-end;
    }

    .quote .bottom {
      flex-direction: row;
      align-items: center;
    }

    .news-share {
      margin-right: -.4rem;
    }
  }
</style>
