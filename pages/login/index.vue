<template>
  <background>
    <card>
      <event-title>登录浪潮</event-title>
      <div class="login-method-container">
        <login-method :redirect="redirect" />
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
    created () {
      if (this.$route.query.status === 'auth_required') {
        this.$message.error('请在登录后尝试访问该页面')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-method-container {
    padding-top: 24px;
  }
</style>
