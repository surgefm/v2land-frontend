<template>
  <div v-if="event">
    <logo class="logo" />
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
    <event-action />
  </div>
</template>

<script>
  import $ from 'postman-url-encoder'
  import config from '~/const'

  export default {
    data () {
      return {
        activeNews: null
      }
    },
    computed: {
      name () {
        return this.$route.params.name
      },
      event () {
        return this.$store.getters.getEvent(this.name)
      },
      newsCollection () {
        return this.$store.getters.getNewsCollection(this.name)
      },
      image () {
        return config.static + this.event.image.imageUrl
      },
      showCover () {
        return this.activeNews &&
          this.$route.hash &&
          this.$route.hash !== '#timeline'
      },
      hash () {
        if (this.$route.hash) {
          return this.$route.hash.slice(1)
        } else {
          return null
        }
      },
      anchoredNews () {
        let hash = this.$route.hash
        if (hash) {
          hash = hash.slice(1)
          let name = this.$route.params.name
          let news = this.$store.getters.getNews({
            name,
            id: hash
          })
          if (news) {
            let copy = Object.assign({}, news)
            copy.tag = '相关新闻'
            return copy
          }
        }
        return null
      }
    },
    methods: {
      showNewsAboveCover (news) {
        let show = this.showCover && news.id === this.activeNews
        if (show) {
          try {
            setTimeout(() => {
              let element = document.getElementById('i' + this.activeNews)
              if (element) {
                element.scrollIntoView()
                window.scrollBy(0, -50)
              }
            }, 50)
          } catch (e) {}
        }

        return show
      },
      hideNews (news) {
        return this.showCover && news.id === this.$route.hash.slice(1)
      },
      clickAnchoredNews (news) {
        setTimeout(() => {
          if (this.hash !== news.id) {
            this.activeNews = news.id
          }
        }, 50)
      },
      removeCover () {
        this.activeNews = null
        window.location.hash = 'timeline'
      }
    },
    async asyncData ({ store, params, redirect, route }) {
      let event = await store.dispatch('getEvent', params.name)
      if (!event) {
        return redirect('/')
      }
      if (event.name !== params.name) {
        return redirect($.encode('/' + event.name +
          (route.query.news ? ('?news=' + route.query.news) : '')
        ))
      }
      return {}
    },
    mounted () {
      if (!this.$route.hash) {
        window.location.hash = 'timeline'
      }
      if (this.$route.query.news && document) {
        setTimeout(() => {
          let element = document.getElementById(this.$route.query.news)
          let news = document.getElementById('main-' + this.$route.query.news)
          if (element) {
            element.scrollIntoView()
            window.scrollBy(0, -50)
            news.className += ' emphasize'
          }
        }, 200)
      }
    },
    head () {
      let title = this.name + ' - 浪潮，渴望重回土地'
      let image = this.event
        ? (this.event.image ? this.image : null)
        : null
      let description = this.event
        ? this.event.description
        : null
      return {
        title,
        meta: [
          { hid: 't:title', name: 'twitter:title', content: title },
          { hid: 'og:title', property: 'og:title', content: title },
          description ? { hid: 't:description', name: 'twitter:description', content: description } : {},
          description ? { hid: 'og:description', property: 'og:description', content: description } : {},
          image ? { hid: 't:image', name: 'twitter:image', content: image } : {},
          image ? { hid: 'og:image', property: 'og:image', content: image } : {}
        ]
      }
    }
  }
</script>

<style scoped>
  .news {
    width: 100%;
    max-width: 35rem;
  }

  .cover {
    transition: all .2s;
    opacity: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .shadow-cover {
    z-index: 5000;
    opacity: 1;
    background-color: rgba(0, 0, 0, .1);
  }

  .above-cover {
    z-index: 5001;
  }

  .hide-news {
    display: none;
  }
</style>
