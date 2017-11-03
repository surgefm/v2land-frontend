<template>
  <div v-if="event">
    <logo class="logo"></logo>
    <background>
      <first-screen :background="event.image">
        <event-abstract slot="header" :detail="event"></event-abstract>
      </first-screen>
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
