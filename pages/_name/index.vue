<template>
  <div v-if="event">
    <background>
      <event-abstract :detail="event" />
      <div 
        v-for="(news, i) of newsCollection"
        :key="news.id"
        :id="'i' + news.id"
        :class="[
          'news',
          showNewsAboveCover(news) ? 'above-cover' : '',
          hideNews(news) ? 'hide-news' : ''
        ]"
      >
        <div class="news" @click="activeNews = news.id">
          <event-news
            :news="news"
            :order="i + 1"
            :id="'main-i' + news.id"
            :event="event"
          />
        </div>
        <div
          class="news"
          v-if="showNewsAboveCover(news)"
          @click="clickAnchoredNews(anchoredNews)"
        >
          <event-news :news="anchoredNews" />
        </div>
      </div>
      <div
        :class="[
          'cover',
          showCover ? 'shadow-cover' : ''
        ]"
        @click="removeCover"
      />
      <page-foot />
    </background>
  </div>
</template>

<script>
  import config from '~/const';

  export default {
    data() {
      return {
        activeNews: null,
      };
    },
    computed: {
      name() {
        return this.$route.params.name;
      },
      event() {
        return this.$store.getters.getEvent(this.name);
      },
      newsCollection() {
        return this.$store.getters.getNewsCollection(this.name);
      },
      image() {
        return config.static + this.event.headerImage.imageUrl;
      },
      showCover() {
        return this.activeNews &&
          this.$route.hash &&
          this.$route.hash !== '#timeline';
      },
      hash() {
        if (this.$route.hash) {
          return this.$route.hash.slice(1);
        } else {
          return null;
        }
      },
      anchoredNews() {
        let hash = this.$route.hash;
        if (hash) {
          hash = hash.slice(1);
          const name = this.$route.params.name;
          const news = this.$store.getters.getNews({
            name,
            id: hash,
          });
          if (news) {
            const copy = Object.assign({}, news);
            copy.tag = '相关新闻';
            return copy;
          }
        }
        return null;
      },
    },
    methods: {
      showNewsAboveCover(news) {
        const show = this.showCover && news.id === this.activeNews;
        if (show) {
          try {
            setTimeout(() => {
              const element = document.getElementById('i' + this.activeNews);
              if (element) {
                element.scrollIntoView();
                window.scrollBy(0, -50);
              }
            }, 50);
          } catch (e) {
            // do nothing here
          }
        }

        return show;
      },
      hideNews(news) {
        return this.showCover && news.id === this.$route.hash.slice(1);
      },
      clickAnchoredNews(news) {
        setTimeout(() => {
          if (this.hash !== news.id) {
            this.activeNews = news.id;
          }
        }, 50);
      },
      removeCover() {
        this.activeNews = null;
        window.location.hash = 'timeline';
      },
    },
    async asyncData({ store, params, redirect, route }) {
      await store.dispatch('getEvent', params.name);
      return {};
    },
    mounted() {
      window.location.hash = 'timeline';
      if (this.$route.query.news && document) {
        window.onload = () => {
          setTimeout(() => {
            const element = document.getElementById('i' + this.$route.query.news);
            const news = document.getElementById('main-i' + this.$route.query.news);
            if (element) {
              element.scrollIntoView();
              window.scrollBy(0, -50);
              news.className += ' emphasize';
            }
          }, 100);
        };
      }
    },
    head() {
      const title = this.name + ' - 浪潮，你的社会事件追踪工具';
      const image = this.event
        ? (this.event.headerImage ? this.image : null)
        : null;
      const description = this.event
        ? this.event.description
        : null;
      return {
        title,
        meta: [
          description ? { hid: 'description', name: 'description', content: description } : {},
          { hid: 't:title', name: 'twitter:title', content: title },
          { hid: 'og:title', property: 'og:title', content: title },
          description ? { hid: 't:description', name: 'twitter:description', content: description } : {},
          description ? { hid: 'og:description', property: 'og:description', content: description } : {},
          image ? { hid: 't:image', name: 'twitter:image', content: image } : {},
          image ? { hid: 'og:image', property: 'og:image', content: image } : {},
        ],
      };
    },
  };
</script>

<style lang="scss" scoped>
  .news {
    width: 100%;
    max-width: 35rem;
  }

  .cover {
    transition: background-color .2s, opacity .2s, z-index 0s;
    opacity: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -100;
  }

  .shadow-cover {
    z-index: 1900;
    opacity: 1;
    background-color: rgba(0, 0, 0, .4);
  }

  .above-cover {
    z-index: 1901;
  }

  .hide-news {
    display: none;
  }
</style>
