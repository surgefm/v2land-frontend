<template>
  <background>
    <card>
      <p class="tag light-font" v-if="!isAdminAdmit">{{ name }}</p>
      <event-title>审核新闻队列</event-title>
      <p v-if="!(newsCollection.length > 0)">
        队列暂空
      </p>
    </card>
    <div
      v-for="(news, i) of newsCollection"
      :key="news.id"
      :class="['news', 'news-' + i]"
      :id="news.id"
    >
      <event-news
        :news="news"
        mode="admit"
        :order="Number(i) + 1"
        v-on:update="update"
      >
      </event-news>
    </div>
    <event-action></event-action>
    <logo class="logo"></logo>
    <page-foot/>
  </background>
</template>

<script>
  export default {
    computed: {
      name () {
        return this.$route.params.name
      },
      newsCollection () {
        if (this.isAdminAdmit) {
          return this.$store.getters.getPendingNews()
        } else {
          return this.$store.getters.getPendingNews(this.name)
        }
      },
      isAdminAdmit () {
        return this.name === 'admin'
      }
    },
    methods: {
      update () {
        if (this.isAdminAdmit) {
          this.$store.dispatch('getPendingNews')
        } else {
          this.$store.dispatch('getPendingNews', this.$route.params.name)
          this.$store.dispatch('fetchEvent', this.$route.params.name)
        }
      }
    },
    async asyncData ({ store, route }) {
      if (route.params.name === 'admin') {
        return store.dispatch('getPendingNews')
      } else {
        return store.dispatch('getPendingNews', route.params.name)
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        if (!vm.$store.getters.isClientAdmin) {
          vm.$message.error('你无权访问该页面')
          vm.$router.push('/' + vm.$route.params.name)
        }
      })
    }
  }
</script>

<style scoped>
  .news {
    width: 100%;
    max-width: 35rem;
  }

  .news-0 {
    margin-top: 1rem;
  }

  .tag {
    font-size: .9rem;
    margin-right: .5rem;
  }
</style>
