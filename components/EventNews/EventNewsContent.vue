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
        v-analytics="{
          action: 'linkClick',
          label: 'newsUrl',
          value: news.id,
        }"
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
      <div class="bottom-left">
        <el-tooltip
          :content="getString('ymdhm')"
          placement="bottom"
        >
          <span
            class="bottom-date"
            v-clipboard="newsUrl"
            @success="$message.success('已将该新闻分享链接拷贝至剪贴板')"
          >
            {{ getString() }}
          </span>
        </el-tooltip>
        <span
          class="bottom-history"
          @click="contribDialogVisible = true"
          v-analytics="{
            action: 'buttonClick',
            label: 'newsContributionRecord',
            value: news.id,
          }"
        >
          编辑记录
        </span>
      </div>
      <event-news-admit
        class="news-share"
        v-if="mode === 'admit'"
        :news="news"
        v-on:admitted="$emit('admitted')"
        v-on:rejected="$emit('rejected')"
      />

      <a
        v-else-if="mode === 'quote'"
        :href="`/${news.event.id || news.event}/${news.id}`"
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

    <el-dialog
      title="新闻编辑记录"
      :visible.sync="contribDialogVisible"
      :append-to-body="true"
    >
      <event-news-contribution :news="news" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="contribDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import EventNewsContribution from '~/components/EventNews/EventNewsContribution.vue';
  import EventNewsAdmit from '~/components/EventNews/EventNewsAdmit.vue';
  import EventNewsShare from '~/components/EventShare.vue';
  import CommentViewer from '~/components/Comment/Viewer.vue';
  import config from '~/const';

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
        contribDialogVisible: false,
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
      date() {
        let newTime = new Date(this.news.time).getTime();
        const minutesOffset = new Date().getTimezoneOffset() + 480;
        newTime += minutesOffset * 60000;
        return new Date(newTime);
      },
      newsUrl() {
        const event = this.event || this.news.event;
        if (event.id) {
          return `${config.baseUrl}${event.id}/${this.news.id}/${event.pinyin}`;
        }

        return `config.baseUrl${event}/${this.news.id}`;
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
      'event-news-contribution': EventNewsContribution,
      'event-news-admit': EventNewsAdmit,
      'event-news-share': EventNewsShare,
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
          name: 'event-news-pinyin',
          params: {
            name: this.eventName,
            news: this.news.id,
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

  .bottom-left {
    margin-bottom: 3px;
    display: flex;
  }

  .bottom-date, .bottom-history {
    font-size: 14px;
    color: #888;
    font-weight: 500;
    cursor: pointer;
    line-height: 1.3;
    border-bottom: 1px transparent solid;
  }

  .bottom-date {
    margin-right: .5rem;
  }

  .bottom-history {
    visibility: hidden;
  }

  .news-container:hover .bottom-history {
    visibility: visible;
  }

  .bottom-history:hover {
    border-bottom: 1px #888 solid;
  }

  @media (max-width: 600px) {
    .news {
      padding-top: 0;
    }
    
    .bottom {
      margin-top: .25rem;
      flex-direction: column;
      align-items: flex-end;
    }

    .quote .bottom {
      flex-direction: row;
      align-items: center;
    }

    .bottom-left {
      flex-direction: row-reverse;
    }

    .bottom-date {
      margin-right: 0;
    }

    .bottom-history {
      margin-right: .5rem;
      visibility: visible;
    }

    .news-share {
      margin-right: -.4rem;
    }
  }
</style>
