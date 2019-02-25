<template>
  <background>
    <card>
      <event-title>用户信息</event-title>
      <client-information-form />
    </card>
    <page-foot />
  </background>
</template>

<script>
import ClientInformationForm from '~/components/Client/ClientInformationForm.vue';

export default {
  components: {
    'client-information-form': ClientInformationForm,
  },
  async asyncData({ store }) {
    return store.dispatch('getClient');
  },
  head() {
    return {
      title: '用户设置 - 浪潮，你的社会事件追踪工具',
    };
  },
};
</script>
