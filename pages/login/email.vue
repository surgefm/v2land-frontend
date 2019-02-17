<template>
  <background>
    <card>
      <event-title>登录浪潮</event-title>
      <login-form />
    </card>
    <page-foot />
  </background>
</template>

<script>
import LoginForm from '~/components/LoginForm.vue';

export default {
  components: {
    'login-form': LoginForm,
  },
  async asyncData({ store }) {
    await store.dispatch('getAvailableAuthMethod');
  },
  head() {
    return {
      title: '登录浪潮',
    };
  },
};
</script>
