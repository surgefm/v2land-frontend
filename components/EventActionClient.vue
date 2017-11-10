<template>
  <nuxt-link
    v-if="!isLoggedIn"
    class="subscribe-container"
    to="/login"
  >
    <span class="text light-font">登录浪潮</span>
    <i class="icon icon-log-in light-font"></i>
  </nuxt-link>
  <div v-else class="subscribe-container" @click="logout">
    <span class="text light-font">退出登录</span>
    <i class="icon icon-log-out light-font"></i>
  </div>
</template>

<script>
  export default {
    computed: {
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('logout')
      }
    }
  }
</script>
