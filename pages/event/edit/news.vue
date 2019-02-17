<template>
  <background>
    <card>
      <p class="tag light-font">
        {{ name }}
      </p>
      <event-title>修改新闻</event-title>
      <event-news-information-form
        ref="form"
        class="news-form"
        :data="'editNews-' + $route.params.id"
        mode="edit"
        @submit="submit"
      />
    </card>
    <page-foot />
  </background>
</template>

<script>
import EventNewsInformationForm from '~/components/EventNews/EventNewsInformationForm';

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
    uid() {
      return 'editNews-' + this.$route.params.id;
    },
  },
  async asyncData({ store, route }) {
    await store.dispatch('getEvent', route.params.name);
    return store.dispatch('getNews', route.params.id);
  },
  methods: {
    async submit() {
      const data = this.$store.state.temp[this.uid];
      await this.$store.dispatch('editNews', {
        id: this.$route.params.id,
        data,
      });
      const { name } = this.$route.params;
      this.$store.dispatch('fetchEvent', { name });
      this.$message('修改成功');
      this.$router.push(`/${this.$route.params.name}`);
    },
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
