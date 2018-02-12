<template>
  <background>
    <card class="auth-container">
      <event-title>绑定账号</event-title>
      <span v-if="showForms">
        {{ sitename }}账号连接成功，请创建或登录浪潮账号以完成绑定。
      </span>
      <div class="register-or-login" v-if="showForms">
        <div class="registration-container">
          <span class="registration-title">创建账号</span>
          <registration-form
            :username="username"
            :email="email"
            v-on:registered="connect"
          />
        </div>
        <div class="login-container">
          <div class="divider" />
          <div>
            <span class="login-title">登录浪潮</span>
            <login-form
              :authorizing="true"
              v-on:logged-in="connect"
            />
          </div>
        </div>
      </div>
      <div v-else class="connecting">
        <loading-indicator />
        <span>正在绑定</span>
      </div>
    </card>

    <logo class="logo" />
    <page-foot />
    <event-action />
  </background>
</template>

<script>
  import RegistrationForm from '~/components/RegistrationForm.vue'
  import LoginForm from '~/components/LoginForm.vue'

  export default {
    data () {
      return {
        showForms: false,
        username: null,
        email: null,
        site: null,
        auth: {}
      }
    },
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
      },
      sitename () {
        switch (this.site) {
          case 'twitter':
            return 'Twitter '
          case 'weibo':
            return '微博'
        }

        return ''
      }
    },
    methods: {
      async connect () {
        this.showForms = false
        try {
          const response = await this.$axios.post('/auth', {
            authId: this.auth.id
          })
          this.$message.success(response.data.message)
          let redirect = this.$route.query.redirect || '/'
          while (redirect && redirect.length > 1 && redirect[1] === '/') {
            redirect = redirect.slice(1)
          }
          this.$router.push(redirect)
        } catch (err) {
          this.$message.error(err)
          this.$router.push({
            path: 'login',
            query: {
              redirect: this.$route.query.redirect
            }
          })
        }
      }
    },
    components: {
      'registration-form': RegistrationForm,
      'login-form': LoginForm
    },
    async asyncData ({ $axios, query, redirect, store }) {
      let path = `auth/${query.site}/redirect?`
      path += `token=${query.token}&verifier=${query.verifier}`

      try {
        let response = await $axios.get(path)
        if (response.status === 201) {
          await store.dispatch('getClient')
          let redirectUrl = '/'
          redirectUrl += query.redirect ? ((query.redirect[0] === '/')
            ? query.redirect.slice(1)
            : query.redirect) : ''
          redirect(redirectUrl)
        } else if (response.status === 202) {
          return {
            showForms: true,
            username: response.data.auth.profile.name,
            site: query.site,
            auth: response.data.auth
          }
        }
      } catch (err) {
        redirect('/login', {
          status: 'auth_failed',
          redirect: query.redirect
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .auth-container {
    display: flex !important;
    flex-direction: column;
  }

  .register-or-login, .login-container {
    display: flex;
    position: relative;
    margin-top: .5rem;
  }

  .login-container {
    margin-top: 0;
  }

  .registration-container {
    position: relative;
    left: -1rem;
  }

  .registration-title {
    position: relative;
    left: 1rem;
    font-size: 1.5rem !important;
    font-weight: bold;
  }

  .login-title {
    position: relative;
    left: 1.5rem;
    font-size: 1.5rem !important;
    font-weight: bold;
  }

  .login-container .divider {
    height: 80%;
    width: 1px;
    background-color: #aaa;
    position: absolute;
    left: .25rem;
    margin: 10% 0;
  }

  .connecting {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .connecting * {
    font-size: 1rem !important;
  }
</style>
