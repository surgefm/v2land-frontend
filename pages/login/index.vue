<template>
  <background>
    <card>
      <event-title>登录浪潮</event-title>
      <div class="login-method-container">
        <login-method
          :availableMethods="availableMethods"
          :redirect="redirect"
        />
      </div>
    </card>
    <page-foot />
  </background>
</template>

<script>
  import config from '~/const';

  export default {
    data() {
      return {
        availableMethods: [],
      };
    },
    computed: {
      redirect() {
        const base = config.baseUrl + 'login/auth?redirect=';
        const redirect = this.$route.query.redirect;
        if (redirect) {
          if (redirect[0] === '/') {
            return base + redirect.slice(1);
          } else {
            return base + redirect;
          }
        }
        return base;
      },
    },
    async asyncData({ store, query, redirect }) {
      const options = await store.dispatch('getAvailableAuthMethod');
      if (options.length === 1) {
        let path = '/login/email';
        if (query.redirect) {
          path += '?redirect=' + query.redirect;
        }
        redirect(path);
      }
      return {
        availableMethods: options,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .login-method-container {
    padding-top: 24px;
  }
</style>
