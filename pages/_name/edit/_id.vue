<template>
  <background>
    <card>
      <p class="tag light-font">{{ $route.params.name }}</p>
      <event-title>修改新闻</event-title>
      <event-news-information-form
        class="news-form"
        :data="'editNews-' + $route.params.id"
        v-on:submit="submit"
        ref="form"
        mode="edit"
      />
    </card>
    <event-action />
    <logo class="logo" />
    <page-foot />
  </background>
</template>

<script>
  import EventNewsInformationForm from '~/components/EventNewsInformationForm'
  
  export default {
    methods: {
      async submit () {
        let data = this.$store.state.temp[this.uid]
        this.$store.dispatch('editNews', {
          id: this.$route.params.id,
          data
        })
          .then(() => {
            this.$store.dispatch('fetchEvent', this.$route.params.name)
          })
          .then(() => {
            this.$message('修改成功')
            this.$router.push(`/${this.$route.params.name}?news=${this.$route.params.id}`)
          })
      }
    },
    computed: {
      uid () {
        return 'editNews-' + this.$route.params.id
      }
    },
    components: {
      'event-news-information-form': EventNewsInformationForm
    },
    beforeCreate () {
      let news = this.$store.getters.getNews({
        name: this.$route.params.name,
        id: this.$route.params.id
      })

      if (!news) {
        this.$message('未找到该新闻')
        this.$router.push('/' + this.$route.params.name)
      }
    },
    async asyncData ({ store, route }) {
      return store.dispatch('getEvent', route.params.name)
    }
  }
</script>

<style lang="scss" scoped>
  .tag {
    font-size: .9rem;
    margin-right: .5rem;
  }

  .news-form {
    margin-top: 1rem;
  }
</style>
