<template>
  <background>
    <card>
      <p class="tag light-font">{{ $route.params.name }}</p>
      <event-title>管理事件</event-title>
      <div class="sorter">修改基本信息</div>
      <event-information-form
        mode="edit"
        :data="'EditEvent-' + $route.params.name"
        :name="$route.params.name"
        class="event-form"
        v-on:submit="submit"
      />
      <div class="divider" />
      <div class="sorter">修改事件题图</div>
      <event-image-form :name="$route.params.name" />
    </card>
    <page-foot />
  </background>
</template>

<script>
  import EventInformationForm from '~/components/EventInformationForm.vue';
  import EventImageForm from '~/components/EventCard/EventImageForm.vue';

  export default {
    components: {
      'event-information-form': EventInformationForm,
      'event-image-form': EventImageForm,
    },
    methods: {
      submit() {
        const data = this.$store.state.temp['EditEvent-' + this.$route.params.name];
        this.$store.dispatch('editEvent', {
          name: this.$route.params.name,
          data,
        })
          .then(() => {
            this.$store.dispatch('fetchEvent', this.$route.params.name);
          })
          .then(() => {
            this.$message('修改成功');
            const url = this.$route.query.redirect || `/${this.$route.params.name}`;
            this.$router.push(url);
          });
      },
    },
    async asyncData({ route, store }) {
      return store.dispatch('getEvent', route.params.name);
    },
    head() {
      return {
        title: '管理事件 - ' + this.$route.params.name,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .tag {
    line-height: 1;
    margin-top: .75rem;
  }

  .sorter {
    width: 100%;
    text-align: left;
  }

  .event-form {
    margin-top: 1rem;
  }
</style>
