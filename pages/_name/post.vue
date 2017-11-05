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
      >
      </event-news-information-form>
    </card>
    <event-action></event-action>
    <logo class="logo"></logo>
    <page-foot/>
  </background>
</template>

<script>
  import EventNewsInformationForm from '~/components/EventNewsInformationForm'
  import axios from '~/plugins/axios'
  import $ from 'postman-url-encoder'

  export default {
    methods: {
      async submit () {
        let data = this.$store.state.temp.addNews
        let url = $.encode('events/' +
          this.$route.params.name + '/news')
        axios.put(url, data)
          .then(() => {
            this.$message.success('提交成功，该新闻会在通过审核后列入事件时间轴内')
            this.$refs.form.resetForm()
          })
          .catch(() => {
            this.$message.error('服务器开小差了，神秘')
          })
      }
    },
    computed: {
      name () {
        return this.$route.params.name
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
          { hid: 't:description', name: 'twitter:description', content: `为${this.name}提交新闻` },
          { hid: 'og:description', property: 'og:description', content: `为${this.name}提交新闻` },
          { hid: 't:image', name: 'twitter:image', content: 'https://s.langchao.co/twitter-icon.png' },
          { hid: 'og:image', property: 'og:image', content: 'https://s.langchao.co/twitter-icon.png' },
          { hid: 't:card', name: 'twitter:card', content: 'summary' }
        ]
      }
    }
  }
</script>

<style scoped>
  .tag {
    font-size: .9rem;
    margin-right: .5rem;
  }

  .news-form {
    margin-top: 1rem;
  }
</style>
