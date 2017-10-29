<template>
  <card v-if="news" class="news-container">
    <span v-if="news.tag" class="tag light-font">
      {{ news.tag }}
    </span>
    <span v-if="news.source" class="source light-font">
      {{ news.source }}
    </span>
    <br v-if="news.source || news.tag">
    <p v-if="news.title" class="title">
      {{ news.title }}
    </p>
    <p v-if="news.content" class="news">
      {{ news.content }}
    </p>
    <div class="bottom">
      <span class="bottom-date">
        {{ getString(news.date) }}
      </span>
      <event-news-share class="news-share"></event-news-share>
    </div>
    <span v-if="order" class="order light-font">
      {{ order }}
    </span>
  </card>
</template>

<script>
  import Card from './Card.vue'
  import EventNewsShare from './EventNewsShare.vue'

  export default {
    props: {
      news: Object,
      order: Number
    },
    components: {
      Card,
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
