<template>
  <div class="stack-container" :class="[mode]">
    <span
      class="top-tag light-font event-tag"
      v-if="showEventName"
      @click="redirectEvent"
    >{{ eventName }}</span>
    <el-tooltip
      :content="getString('ymdhm')"
      placement="bottom"
    >
      <span
        class="top-tag"
        v-clipboard="stackUrl"
        @success="$message.success('已将该进展分享链接拷贝至剪贴板')"
      >
        {{ getString() }}
      </span>
    </el-tooltip>

    <br />

    <event-title v-if="stack.title">
      {{ stack.title }}
    </event-title>

    <span v-if="stack.news" class="tag light-font">
      {{ `进展 / ${stack.news.length} 条新闻` }}
    </span>

    <p v-if="stack.description" class="stack-description">
      {{ stack.description }}
    </p>

    <comment-viewer
      v-if="news.comment"
      :input="news.comment"
      mode="remark"
      class="comment-viewer"
    />
    <div class="bottom">
      <event-news-admit
        class="news-share"
        v-if="mode === 'admit'"
        :news="news"
        v-on:admitted="$emit('admitted')"
        v-on:rejected="$emit('rejected')"
      />

      <a
        v-else-if="mode === 'quote'"
        :href="`/${stack.event.id || stack.event}/${stack.id}`"
        onclick="return false;"
        class="link"
      >
        <el-button type="primary" size="medium" @click="redirect">
          前往进展
        </el-button>
      </a>

      <event-share
        v-else
        class="stack-share"
        :object="stack"
        type="stack"
      />
    </div>
  </div>
</template>

<script>
  import EventShare from '~/components/EventShare.vue';
  import CommentViewer from '~/components/Comment/Viewer.vue';
  import config from '~/const';

  export default {
    name: 'EventStackContent',
    props: {
      stack: Object,
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
        if (this.stack.event === this.route.params.name ||
          (this.event && this.stack.event === this.event.id)) {
          return false;
        }

        if (this.event) return true;

        const event = this.$store.getters.getEvent(this.stack.event);
        if (event) {
          this.eventName = event.name;
          return true;
        }

        return false;
      },
      date() {
        const news = this.stack.news[this.stack.news.length - 1];
        let newTime = new Date(news.time).getTime();
        const minutesOffset = new Date().getTimezoneOffset() + 480;
        newTime += minutesOffset * 60000;
        return new Date(newTime);
      },
      stackUrl() {
        const event = this.event || this.stack.event;
        if (event.id) {
          return `${config.baseUrl}${event.id}/${event.pinyin}/${this.stack.id}`;
        }

        return `config.baseUrl${event}/${this.stack.id}`;
      },
      route() {
        return this.$mockroute || this.$route;
      },
      router() {
        return this.$mockrouter || this.$router;
      },
    },
    components: {
      'event-share': EventShare,
      'comment-viewer': CommentViewer,
    },
    methods: {
      getString(mode = 'ymd') {
        const date = this.date;
        if (isNaN(date.getTime())) {
          return '';
        }

        let string = '';
        string += date.getFullYear() + ' 年 ';
        string += (date.getMonth() + 1) + ' 月 ';
        string += date.getDate() + ' 日';

        if (mode === 'ymd') {
          return string;
        }

        string = '北京时间 ' + string + ' ';
        string += date.getHours() + ' 时 ';
        string += date.getMinutes() + ' 分';
        return string;
      },
      redirect() {
        this.router.push({
          name: 'event-pinyin-news',
          params: {
            name: this.eventName,
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
    async created() {
      const eventId = this.stack.event.id || this.stack.event;
      this.eventName = (await this.$store.dispatch('getEvent', eventId)).name;
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/variables.scss";

  .top-tag {
    font-size: 12px;
  }

  .tag {
    font-size: 11px;
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
    justify-content: flex-end;
    align-items: center;
  }

  @media (max-width: 600px) {
    .stack-description {
      padding-top: 0;
    }
    
    .bottom {
      margin-top: .25rem;
      flex-direction: column;
    }

    .quote .bottom {
      flex-direction: row;
      align-items: center;
    }

    .stack-share {
      margin-right: -.4rem;
    }
  }
</style>
