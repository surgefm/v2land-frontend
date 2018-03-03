<template>
  <background>
    <card>
      <event-title>创建浪潮账户</event-title>
      <registration-form />
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
  };
</script>
