<template>
  <nuxt-link class="subscribe-container" :to="'/' + this.$route.params.name">
    <span class="text light-font">返回事件</span>
    <i class="icon el-icon-back light-font"></i>
  </nuxt-link>
</template>

<script>
  import '~/assets/EventAction.scss'

  export default { }
</script>

<style scoped>
</style>
