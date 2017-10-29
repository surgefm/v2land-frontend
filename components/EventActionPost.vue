<template>
  <nuxt-link
    class="subscribe-container"
    :to="'/' + this.$route.params.name + '/post'"
  >
    <span class="text light-font">添加新闻</span>
    <i class="icon el-icon-plus light-font"></i>
  </nuxt-link>
</template>

<script>
  import '~/assets/EventAction.scss'

  export default { }
</script>

<style scoped>
</style>
