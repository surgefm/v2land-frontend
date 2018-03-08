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
    <page-foot />
  </background>
</template>

<script>
  import EventNewsInformationForm from '~/components/EventNews/EventNewsInformationForm';
  import $ from 'postman-url-encoder';

  export default {
    methods: {
      async submit() {
        const data = this.$store.state.temp.addNews;
        const url = $.encode(`event/${this.$route.params.name}/news`);
        this.$axios.post(url, data)
          .then(() => {
            if (this.isAdmin) {
              this.$store.dispatch('fetchEvent', this.name)
                .then(() => {
                  this.$message.success('提交成功，该新闻已放入事件合辑内');
                  this.$refs.form.resetForm();
                  this.$refs.form.resetButton();
                });
            } else {
              this.$message.success('提交成功，该新闻会在通过审核后列入事件合辑内');
              this.$refs.form.resetForm();
              this.$refs.form.resetButton();
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('服务器开小差了，神秘');
            this.$refs.form.resetButton();
          });
      },
    },
    computed: {
      name() {
        return this.$route.params.name;
      },
      isAdmin() {
        return this.$store.getters.isClientAdmin;
      },
    },
    components: {
      'event-news-information-form': EventNewsInformationForm,
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
  .tag {
    font-size: .9rem;
    margin-right: .5rem;
  }

  .news-form {
    margin-top: 1rem;
  }
</style>
