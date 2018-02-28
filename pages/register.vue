<template>
  <background>
    <card>
      <event-title>创建浪潮账户</event-title>
      <registration-form />
    </card>
    <logo class="logo" />
    <page-foot />
    <event-action />
  </background>
</template>

<script>
  import RegistrationForm from '~/components/RegistrationForm.vue'

  export default {
    components: {
      'registration-form': RegistrationForm
    }
  }
</script>
