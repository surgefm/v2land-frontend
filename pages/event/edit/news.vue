<template>
  <background>
    <card>
      <p class="tag light-font">{{ name }}</p>
      <event-title>修改新闻</event-title>
      <event-news-information-form
        class="news-form"
        :data="'editNews-' + $route.params.id"
        v-on:submit="submit"
        ref="form"
        mode="edit"
      />
    </card>
    <page-foot />
  </background>
</template>

<script>
  import EventNewsInformationForm from '~/components/EventNews/EventNewsInformationForm';

  export default {
    methods: {
      async submit() {
        const data = this.$store.state.temp[this.uid];
        this.$store.dispatch('editNews', {
          id: this.$route.params.id,
          data,
        })
          .then(() => {
            this.$store.dispatch('fetchEvent', this.$route.params.name);
          })
          .then(() => {
            this.$message('修改成功');
            this.$router.push(`/${this.$route.params.name}/${this.$route.params.id}`);
          });
      },
    },
    computed: {
      name() {
        return this.event.name;
      },
      event() {
        return this.$store.getters.getEvent(this.$route.params.name);
      },
      uid() {
        return 'editNews-' + this.$route.params.id;
      },
    },
    components: {
      'event-news-information-form': EventNewsInformationForm,
    },
    async asyncData({ store, route }) {
      await store.dispatch('getEvent', route.params.name);
      return store.dispatch('getNews', route.params.id);
    },
    head() {
      return {
        title: '修改新闻 - ' + this.name,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .news-form {
    margin-top: 1rem;
  }
</style>
