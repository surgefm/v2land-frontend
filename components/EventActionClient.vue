<template>
  <div
    v-if="!isLoggedIn"
    class="subscribe-container"
    @click="login"
  >
    <span class="text light-font">登录浪潮</span>
    <i class="icon icon-log-in light-font" />
  </div>
  <div v-else class="subscribe-container" @click="logout">
    <span class="text light-font">退出登录</span>
    <i class="icon icon-log-out light-font" />
  </div>
</template>

<script>
  import redirect from '~/middleware/permission'

  export default {
    computed: {
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      }
    },
    methods: {
      login () {
        this.$router.push({
          path: '/login',
          query: {
            redirect: this.$route.path
          }
        })
      },
      async logout () {
        await this.$store.dispatch('logout')
        this.$message.success('成功退出登录')
        let path = redirect({ component: this })
        if (path) {
          this.$router.push('/')
        }
      }
    }
  }
</script>
