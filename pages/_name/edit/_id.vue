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
            this.$router.push(`/${this.$route.params.name}?news=${this.$route.params.id}`);
          });
      },
    },
    computed: {
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
  };
</script>

<style lang="scss" scoped>
  .news-form {
    margin-top: 1rem;
  }
</style>
