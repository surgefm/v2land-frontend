<template>
  <div class="footer">
    <span>
      © {{ new Date().getFullYear() }} Langchao.co
    </span>
    <nuxt-link to="/about" class="link">
      关于浪潮
    </nuxt-link>
    <nuxt-link :to="`/login?redirect=${$route.path}`" class="link" v-if="!isLoggedIn">
      登录
    </nuxt-link>
    <span v-else class="link" @click="logout">
      注销账号
    </span>
  </div>
</template>

<script>
  import axios from '~/plugins/axios'

  export default {
    computed: {
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      }
    },
    methods: {
      logout () {
        try {
          axios.get('clients/logout')
            .then(() => {
              document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
              window.location = window.location
            })
        } catch (err) {}
      }
    }
  }
</script>

<style scoped>
  .footer {
    width: 100%;
    text-align: center;
    font-size: .75rem;
    color: #586069 !important;
    margin: 1rem 0 3rem 0;
  }

  .link {
    color: #586069 !important;
    padding: .25rem;
    background-color: transparent !important;
    box-shadow: none !important;
    margin-left: .25rem;
    cursor: pointer;
  }
</style>
