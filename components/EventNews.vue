<template>
  <card v-if="news" class="news-container hover">
    <div class="top-container">
      <span v-if="order" class="order light-font">
        {{ order }}
      </span>
      <div class="title-container">
        <nuxt-link class="tag" v-if="news.event" :to="`/${news.event.name}`">
          <span class="light-font">
            {{ news.event.name }}
          </span>
        </nuxt-link>
        <span v-if="order === 1" class="tag light-font">
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
    </div>
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
    font-weight: 500;
    padding-bottom: .25rem;
  }

  .order {
    font-size: 4.25rem;
    line-height: 1;
    position: absolute;
    right: calc(100% - 1.25rem);
    top: 1.5rem;
    font-family: 'Times New Roman', Times, serif;
    cursor: default;
    font-weight: 900;
  }

  .top-container {
    display: flex;
  }

  @media (max-width: 500px) {
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
    }
  }
</style>
