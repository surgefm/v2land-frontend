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
    components: {
      'event-news-information-form': EventNewsInformationForm
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
