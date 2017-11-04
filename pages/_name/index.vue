<template>
  <div v-if="event">
    <logo class="logo"></logo>
    <background>
      <!-- <first-screen :background="event.image"> -->
      <event-abstract :detail="event"></event-abstract>
      <!-- </first-screen> -->
      <div 
        v-for="(news, i) of newsCollection"
        :key="news.id"
        :class="['news', 'news-' + i]"
        :id="news.id"
      >
        <event-news :news="news" :order="i + 1"></event-news>
      </div>
      <page-foot/>
    </background>
    <event-action></event-action>
  </div>
</template>

<script>
  import $ from 'postman-url-encoder'
  import config from '~/const'

  export default {
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
      if (this.$route.query.news && document) {
        setTimeout(() => {
          let element = document.getElementById(this.$route.query.news)
          if (element) {
            element.scrollIntoView()
          }
        }, 200)
      }
    },
    head () {
      let title = this.name + ' - 浪潮，渴望重回土地'
      return {
        title,
        meta: [
          { hid: 't:title', name: 'twitter:title', content: title },
          { hid: 'og:title', property: 'og:title', content: title },
          { hid: 't:description', name: 'twitter:description', content: this.event.description },
          { hid: 'og:description', property: 'og:description', content: this.event.description },
          this.event.image ? { hid: 't:image', name: 'twitter:image', content: this.image } : {},
          this.event.image ? { hid: 'og:image', property: 'og:image', content: this.image } : {}
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

  .news-0 {
    margin-top: -2rem;
  }
</style>
