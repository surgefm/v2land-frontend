<template>
  <nuxt-link
    class="subscribe-container"
    :to="route"
  >
    <span class="text light-font">管理进展</span>
    <i class="icon el-icon-d-caret light-font" />
  </nuxt-link>
</template>

<script>
export default {
  computed: {
    route() {
      return `/${this.$route.params.name}/edit/stack`;
    },
  },
};
</script>
