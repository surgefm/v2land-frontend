<template>
  <background>
    <card>
      <p class="tag light-font">{{ $route.params.name }}</p>
      <event-title>添加新闻</event-title>
      <event-news-information-form
        class="news-form"
        data="addNews"
        v-on:submit="submit"
        ref="form"
      />
    </card>
    <event-action />
    <logo class="logo" />
    <page-foot />
  </background>
</template>

<script>
  import EventNewsInformationForm from '~/components/EventNewsInformationForm'
  import $ from 'postman-url-encoder'

  export default {
    methods: {
      async submit () {
        let data = this.$store.state.temp.addNews
        let url = $.encode('events/' +
          this.$route.params.name + (this.isAdmin ? '/news' : '/news/add'))
        this.$axios.put(url, data)
          .then(() => {
            if (this.isAdmin) {
              this.$store.dispatch('fetchEvent', this.name)
                .then(() => {
                  this.$message.success('提交成功，该新闻已放入事件合辑内')
                  this.$refs.form.resetForm()
                  this.$refs.form.resetButton()
                })
            } else {
              this.$message.success('提交成功，该新闻会在通过审核后列入事件合辑内')
              this.$refs.form.resetForm()
              this.$refs.form.resetButton()
            }
          })
          .catch(() => {
            this.$message.error('服务器开小差了，神秘')
          })
      }
    },
    computed: {
      name () {
        return this.$route.params.name
      },
      isAdmin () {
        return this.$store.getters.isClientAdmin
      }
    },
    components: {
      'event-news-information-form': EventNewsInformationForm
    },
    head () {
      return {
        title: '提交新闻 - ' + this.name,
        meta: [
          { hid: 't:title', name: 'twitter:title', content: '提交新闻 - ' + this.name },
          { hid: 'og:title', property: 'og:title', content: '提交新闻 - ' + this.name },
          { hid: 't:description', name: 'twitter:description', content: `在浪潮上为${this.name}提交新闻` },
          { hid: 'og:description', property: 'og:description', content: `在浪潮上为${this.name}提交新闻` },
          { hid: 't:image', name: 'twitter:image', content: 'https://s.langchao.co/twitter-icon.png' },
          { hid: 'og:image', property: 'og:image', content: 'https://s.langchao.co/twitter-icon.png' },
          { hid: 't:card', name: 'twitter:card', content: 'summary' }
        ]
      }
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
