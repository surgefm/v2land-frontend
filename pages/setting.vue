<template>
  <background>
    <card>
      <event-title>用户信息</event-title>
      <client-information-form />
    </card>
    <logo class="logo" />
    <event-action />
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
  };
</script>
