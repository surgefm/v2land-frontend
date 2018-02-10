<template>
  <nuxt-link
    class="subscribe-container"
    :to="'/' + this.$route.params.name + '/subscribe'"
  >
    <span class="text light-font">
      {{ subscribed ? '正在关注' : '关注事件' }}
    </span>
    <i class="icon el-icon-bell light-font" />
  </nuxt-link>
</template>

<script>
  export default {
    data () {
      return {
        subscribed: false
      }
    },
    created () {
      if (this.$store.getters.getEventSubscriptionList(
        this.$route.params.name
      )) {
        this.subscribed = true
      }
    }
  }
</script>
