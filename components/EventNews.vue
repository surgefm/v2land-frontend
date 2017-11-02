<template>
  <card v-if="news" class="news-container">
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
    <p v-if="news.abstract" class="news">
      {{ news.abstract }}
    </p>
    <div class="bottom">
      <span class="bottom-date">
        {{ getString(news.time) }}
      </span>
      <event-news-admit
        class="news-share"
        v-if="mode === 'admit'"
        :news="news"
        v-on:update="$emit('update')"
      >
      </event-news-admit>
      <event-news-share
        v-else
        class="news-share"
        :news="news"
      >
      </event-news-share>
    </div>
    <span v-if="order" class="order light-font">
      {{ order }}
    </span>
  </card>
</template>

<script>
  import EventNewsAdmit from './EventNewsAdmit.vue'
  import EventNewsShare from './EventNewsShare.vue'

  export default {
    props: {
      news: Object,
      order: Number,
      mode: String
    },
    components: {
      'event-news-admit': EventNewsAdmit,
      'event-news-share': EventNewsShare
    },
    methods: {
      getString (input) {
        let date = new Date(input)
        if (isNaN(date.getTime())) {
          return ''
        }

        let string = ''
        string += date.getFullYear() + ' 年 '
        string += (date.getMonth() + 1) + ' 月 '
        string += date.getDate() + ' 日'

        return string
      }
    }
  }
</script>

<style scoped>
  a {
    color: black;
  }

  a:hover {
    text-decoration: underline;
  }

  .news-container {
    position: relative;
  }

  .tag {
    font-size: .9rem;
    margin-right: .5rem;
  }

  .source {
    font-size: .9rem;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.5;
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
    font-weight: bold;
  }

  .order {
    font-size: 4.25rem;
    line-height: 1;
    position: absolute;
    right: calc(100% - 1.25rem);
    top: 1.5rem;
    font-family: 'Times New Roman', Times, serif;
    cursor: default;
  }

  @media (max-width: 500px) {
    .bottom {
      flex-direction: column;
      align-items: flex-end;
    }

    .news-share {
      margin-right: -.4rem;
    }
  }
</style>
