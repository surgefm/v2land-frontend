<template>
  <background>
    <card>
      <event-title>创建浪潮账号</event-title>
      <registration-form @registered="redirect" />
    </card>
    <page-foot />
  </background>
</template>

<script>
import RegistrationForm from '~/components/RegistrationForm.vue';

export default {
  components: {
    'registration-form': RegistrationForm,
  },
  methods: {
    redirect() {
      let path = this.$route.query.redirect || '/';
      if (path[0] !== '/') {
        path = '/' + path;
      }
      this.$router.push(path);
    },
  },
  head() {
    return {
      title: '创建浪潮账号',
    };
  },
};
</script>
