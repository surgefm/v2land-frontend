<template>
  <div
    v-if="!isLoggedIn"
    class="subscribe-container"
    @click="login"
    v-loading="loading"
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
  import redirect from '~/middleware/permission';

  export default {
    data() {
      return {
        loading: false,
      };
    },
    computed: {
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      },
    },
    methods: {
      login() {
        this.$router.push({
          path: '/login',
          query: {
            redirect: this.$route.path,
          },
        });
      },
      async logout() {
        this.loading = true;
        await this.$store.dispatch('logout');
        this.$message.success('成功退出登录');
        this.loading = false;
        const path = redirect({ component: this });
        if (path) {
          this.$router.push('/');
        }
      },
    },
  };
</script>
