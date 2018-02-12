<template>
  <background>
    <card>
      <event-title>登录浪潮</event-title>
      <div class="login-method-container">
        <login-method :redirect="redirect" />
      </div>
    </card>
    <logo class="logo" />
    <page-foot />
    <event-action />
  </background>
</template>

<script>
  import config from '~/const'

  export default {
    computed: {
      redirect () {
        let base = config.baseUrl + 'login/auth?redirect='
        let redirect = this.$route.query.redirect
        if (redirect) {
          if (redirect[0] === '/') {
            return base + redirect.slice(1)
          } else {
            return base + redirect
          }
        }
        return base
      }
    },
    created () {
      if (this.$route.query.status === 'auth_required') {
        this.$message.error('请在登录后尝试访问该页面')
      } else if (this.$route.query.status === 'auth_failed') {
        this.$message.error('在验证绑定状况时发生了错误')
      }

      this.$router.push({
        query: { ...this.$route.query, status: undefined }
      })
    }
  }
</script>

<style lang="scss" scoped>
  .login-method-container {
    padding-top: 24px;
  }
</style>
