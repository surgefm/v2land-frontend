<template>
  <background>
    <card>
      <p class="tag light-font">
        {{ name }}
      </p>
      <event-title>添加新闻</event-title>
      <event-news-information-form
        ref="form"
        class="news-form"
        data="addNews"
        @submit="submit"
      />
    </card>
    <page-foot />
  </background>
</template>

<script>
import EventNewsInformationForm from '~/components/EventNews/EventNewsInformationForm';
import $ from 'postman-url-encoder';

export default {
  components: {
    'event-news-information-form': EventNewsInformationForm,
  },
  computed: {
    name() {
      return this.event.name;
    },
    event() {
      return this.$store.getters.getEvent(this.$route.params.name);
    },
    isAdmin() {
      return this.$store.getters.isClientAdmin;
    },
  },
  methods: {
    async submit() {
      const data = this.$store.state.temp.addNews;
      const url = $.encode(`event/${this.$route.params.name}/news`);
      try {
        await this.$axios.post(url, data);
        if (this.isAdmin) {
          await this.$store.dispatch('fetchEvent', { name: this.name });
          this.$message.success('提交成功，该新闻已放入事件合辑内');
        } else {
          this.$message.success('提交成功，该新闻会在通过审核后列入事件合辑内');
        }
        this.$refs.form.resetForm();
        this.$refs.form.resetButton();
      } catch (err) {
        let message = '服务器开小差了，神秘';
        if (err.response && err.response.data) {
          message = err.response.data.message || message;
        }
        this.$message.error(message);
        this.$refs.form.resetButton();
      }
    },
  },
  head() {
    const description = this.event
      ? this.event.description
      : null;
    return {
      title: '添加新闻 - ' + this.name,
      meta: [
        { hid: 'description', name: 'description', content: description },
        { hid: 't:title', name: 'twitter:title', content: '添加新闻 - ' + this.name },
        { hid: 'og:title', property: 'og:title', content: '添加新闻 - ' + this.name },
        { hid: 't:description', name: 'twitter:description', content: `在浪潮上为${this.name}提交新闻` },
        { hid: 'og:description', property: 'og:description', content: `在浪潮上为${this.name}提交新闻` },
        { hid: 't:image', name: 'twitter:image', content: 'https://s.langchao.co/twitter-icon.png' },
        { hid: 'og:image', property: 'og:image', content: 'https://s.langchao.co/twitter-icon.png' },
        { hid: 't:card', name: 'twitter:card', content: 'summary' },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
  .news-form {
    margin-top: 1rem;
  }
</style>
