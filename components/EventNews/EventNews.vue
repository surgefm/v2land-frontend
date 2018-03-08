<template>
  <card v-if="news" class="news-container hover">
    <div class="top-container">
      <span
        v-if="order"
        v-clipboard="newsUrl"
        @success="copySuccess"
        class="order light-font"
      >
        {{ order }}
      </span>
      <nuxt-link
        class="tag light-font"
        v-if="showEventName"
        :to="`/${eventName}`"
      >
        {{ eventName }}
      </nuxt-link>
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
      <a v-if="news.title" :href="news.url" target="_blank" class="title">
        {{ news.title }}
      </a>
    </div>
    <p v-if="news.abstract" class="news">
      {{ news.abstract }}
    </p>
    <markdown v-if="news.comment" :input="news.comment" />
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
      <event-news-share
        v-else
        class="news-share"
        :object="news"
        type="news"
      />
    </div>
  </card>
</template>

<script>
  import EventNewsAdmit from '~/components/EventNews/EventNewsAdmit.vue';
  import EventNewsShare from '~/components/EventShare.vue';
  import config from '~/const';

  export default {
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
        if (this.news.event === this.$route.params.name ||
          (this.event && this.news.event === this.event.id)) {
          return false;
        }

        if (this.event) return true;

        const event = this.$store.getters.getNews(this.news.event);

        if (event) {
          this.eventName = event.name;
          return true;
        }

        return false;
      },
      newsUrl() {
        return config.baseUrl + this.news.event + '?news=' + this.news.id;
      },
    },
    components: {
      'event-news-admit': EventNewsAdmit,
      'event-news-share': EventNewsShare,
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
      copySuccess() {
        this.$message.success('已将该新闻分享链接拷贝至剪贴板');
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/variables.scss";

  a {
    color: black;
  }

  a:hover {
    border-bottom: .125rem #000 solid;
    padding-bottom: .125rem;
  }

  .news-container {
    position: relative;
  }

  .tag {
    font-size: .9rem;
    margin-right: .5rem;
    text-decoration: none !important;
  }

  a.tag:hover {
    border-color: $light-color;
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

  .order {
    font-size: 4.25rem;
    height: 4.25rem;
    line-height: 1;
    position: absolute;
    right: calc(100% - 1.25rem);
    top: 1.5rem;
    font-family: 'Times New Roman', Times, serif;
    cursor: pointer;
    font-weight: 900;
    transition: all .2s;
  }

  @media (min-width: 600px) {
    .above-cover .order {
      text-shadow: -.25rem 0 0 #000;
      background-color: #1e8bc3;
      color: #fff !important;
      border-radius: .25rem;
      padding: 0 .25rem;
      box-shadow: -.25rem 0 0 #000;
      opacity: 0;
    }
  }

  @media (max-width: 600px) {
    .bottom {
      flex-direction: column;
      align-items: flex-end;
    }

    .news-share {
      margin-right: -.4rem;
    }

    .order {
      position: relative;
      right: initial;
      top: 0;
      left: -.25rem;
      height: 4rem;
      float: left;
      text-shadow: none !important;
    }
  }
</style>
