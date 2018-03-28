<template>
  <div class="footer">
    <div class="logo-container">
      <nuxt-link to="/">
        <logo class="logo-image" mode="simple" />
        <logotype color="#0083a8" :height="32" class="logotype" />
      </nuxt-link>
    </div>
    <div class="content">
      <div class="about-v2land">
        <nuxt-link to="/about" class="link">关于浪潮</nuxt-link>
        <span>·</span>
        <a href="https://handbook.langchao.co" target="_blank">浪潮社区指南</a>
        <span>·</span>
        <a href="https://github.com/v2land" target="_blank">参与项目开发</a>
      </div>
      <span>
        本站与<a href="http://langchao.com" target="_blank">浪潮集团有限公司</a>无关
      </span>
      <span>
        Langchao.org {{ new Date().getFullYear() }}
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      },
    },
    methods: {
      logout() {
        this.$store.dispatch('logout');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .footer {
    width: 100%;
    text-align: center;
    font-size: .75rem;
    color: #586069 !important;
    margin: 1rem 0 3rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .logo-container {
    text-align: center;
  }

  .logo-image {
    height: 2rem;
    padding-right: .5rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    margin-top: .5rem;
    align-items: center;
  }

  .content * {
    line-height: 1.75;
  }

  .content span:not(:last-child) {
    margin-right: .25rem;
  }

  .link, a {
    color: #586069 !important;
    background-color: transparent !important;
    box-shadow: none !important;
    cursor: pointer;
    white-space: nowrap;
  }

  .link, a:not(:last-child) {
    margin-right: .25rem;
  }

  @media (max-width: 600px) {
    .logo-image, .logotype {
      height: 2rem;
    }
  }
</style>
