<template>
  <background>
    <card>
      <event-title>登录浪潮</event-title>
      <div class="login-method-container">
        <login-method v-bind:redirect="redirect"></login-method>
      </div>
    </card>
    <logo class="logo"></logo>
    <page-foot/>
  </background>
</template>

<script>
  export default {
    computed: {
      redirect () {
        let redirect = this.$route.query.redirect
        if (redirect) {
          if (redirect[0] === '/') {
            return redirect.slice(1)
          } else {
            return redirect
          }
        }
        return ''
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        if (vm.$store.state.client.username) {
          vm.$message('你是已登录用户')
          vm.$router.push(vm.$route.query.redirect || '/')
        }
      })
    }
  }
</script>

<style scoped>

.login-method-container {
  padding-top: 24px;
}

</style>
