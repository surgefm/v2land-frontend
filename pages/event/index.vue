<template>
  <div>
    <background>
      <event-abstract-loader v-if="showLoader" />
      <event-news-loader v-if="showLoader" />
      <event-abstract v-if="!showLoader" :detail="event" />
      <div 
        v-if="!showLoader"
        v-for="(news, i) of newsCollection"
        :key="news.id"
        :id="'i' + news.id"
        class="news"
      >
        <event-news
          class="news" 
          :news="news"
          :order="i + 1"
          :id="'main-i' + news.id"
          :event="event"
        />
      </div>
      <nuxt-child v-if="!showLoader" />
      <load-more v-if="!showLoader" :type="'news'">加载更多</load-more>
      <page-foot />
    </background>
  </div>
</template>

<script>
  import config from '~/const';
  import EventAbstract from '~/components/EventAbstract/EventAbstract.vue';
  import EventAbstractLoader from '~/components/EventAbstract/EventAbstractLoader.vue';
  import EventNews from '~/components/EventNews/EventNews.vue';
  import EventNewsLoader from '~/components/EventNews/EventNewsLoader.vue';
  import LoadMore from '~/components/LoadMore.vue';

  export default {
    computed: {
      showLoader() {
        const { status } = this.fetchingStatus;
        return status !== 'loaded' &&
          status !== 'serverLoaded';
      },
      name() {
        return this.$route.params.name;
      },
      fetchingStatus() {
        return this.$store.getters.getFetchingStatus('getEvent');
      },
      event() {
        return this.$store.getters.getEvent(this.name);
      },
      newsCollection() {
        return this.$store.getters.getNewsCollection(this.event.name);
      },
      image() {
        return config.static + this.event.headerImage.imageUrl;
      },
    },
    methods: {
      scrollToNews() {
        if (+this.$route.params.news && document) {
          setTimeout(() => {
            const element = document.getElementById('i' + this.$route.params.news);
            const news = document.getElementById('main-i' + this.$route.params.news);
            if (element) {
              element.scrollIntoView();
              window.scrollBy(0, -50);
              news.className += ' emphasize';
            }

            this.$router.replace({
              ...this.$route,
              name: 'event-pinyin',
            });
          }, 50);
        }
      },
      async init() {
        const status = this.fetchingStatus.status;
        if (status == 'serverLoaded') {
          this.$store.commit('setFetchingStatus', {
            name: 'getEvent',
            status: 'loaded',
          });
        } else {
          const { name } = this.$route.params;
          await this.$store.dispatch('fetchEvent', {
            name,
            isEventPage: true,
          });
        }
        if (!this.$store.getters.isServer) {
          this.scrollToNews();
        }
      },
    },
    async asyncData({ store, params, redirect, route }) {
      if (store.getters.isServer) {
        store.commit('resetAllStatus');
        await store.dispatch('fetchEvent', {
          name: params.name,
          isEventPage: true,
        });
        store.commit('setFetchingStatus', {
          name: 'getEvent',
          status: 'serverLoaded',
        });
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      '$route.params.news'() {
        this.scrollToNews();
      },
    },
    head() {
      let title = this.event.name + ' - 浪潮，你的社会事件追踪工具';
      const image = this.event
        ? (this.event.headerImage ? this.image : null)
        : null;
      let description = this.event
        ? this.event.description
        : null;

      if (this.$route.params.news) {
        const news = this.$store.getters.getNews({ id: this.$route.params.news });
        if (news) {
          title = `${news.title} - ${this.event.name}`;
          description = news.abstract || description;
        }
      }
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
    components: {
      'event-abstract': EventAbstract,
      'event-abstract-loader': EventAbstractLoader,
      'event-news': EventNews,
      'event-news-loader': EventNewsLoader,
      'load-more': LoadMore,
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
