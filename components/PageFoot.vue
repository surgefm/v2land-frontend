<template>
  <div class="footer">
    <span class="copyright">
      © {{ new Date().getFullYear() }} Langchao.co
    </span>
    <nuxt-link to="/about" class="link">
      关于浪潮
    </nuxt-link>
  </div>
</template>

<style scoped>
  .footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .75rem;
    color: #586069 !important;
    margin-bottom: 4rem;
  }

  .copyright {
    margin-right: .5rem;
  }

  .link {
    color: #586069 !important;
    padding: .25rem;
    background-color: transparent !important;
  }
</style>
