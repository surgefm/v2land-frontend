<template>
  <background>
    <card>
      <p class="tag light-font" v-if="!isAdminEdit">{{ name }}</p>
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
    data() {
      return {
        news: {},
      };
    },
    methods: {
      async submit() {
        const data = this.$store.state.temp[this.uid];
        await this.$store.dispatch('editNews', {
          id: this.$route.params.id,
          data,
        });
        await this.$store.dispatch('fetchEvent', this.$route.params.name);
        this.$message('修改成功');
        if (this.isAdminEdit) {
          this.$router.push((this.$route.query.from || '/admin/admit')
            + `?news=${this.$route.params.id}`);
        } else {
          if (this.news.status === 'admitted') {
            this.$router.push(`/${this.$route.params.name}/${this.$route.params.id}`);
          } else {
            this.$router.push({
              name: 'event-admit',
              params: this.$route.params,
              query: { news: this.$route.params.id },
            });
          }
        }
      },
    },
    computed: {
      name() {
        return this.event ? this.event.name : null;
      },
      event() {
        return this.isAdminEdit
          ? null
          : this.$store.getters.getEvent(this.$route.params.name);
      },
      uid() {
        return 'editNews-' + this.$route.params.id;
      },
      isAdminEdit() {
        return this.$route.name === 'admin-news-edit';
      },
    },
    components: {
      'event-news-information-form': EventNewsInformationForm,
    },
    async asyncData({ store, route }) {
      if (route.name !== 'admin-news-edit') {
        await store.dispatch('getEvent', route.params.name);
      }
      const news = await store.dispatch('getNews', route.params.id);
      return { news };
    },
    head() {
      return {
        title: '修改新闻 - ' + (this.name || this.$route.params.id),
      };
    },
  };
</script>

<style lang="scss" scoped>
  .news-form {
    margin-top: 1rem;
  }
</style>
