<template>
  <background>
    <card class="auth-container">
      <event-title>绑定账号</event-title>
      <span v-if="showForms">
        {{ siteinfo }}连接成功，请创建或登录浪潮账号以完成绑定。
      </span>
      <div class="switch-form" v-if="showForms">
        <span
          :class="[
            'switch-title',
            !register || 'light-font'
          ]"
          @click="register = true"
        >
          创建账号
        </span>
        <span class="switch-form-divider">/</span>
        <span
          :class="[
            'switch-title',
            register || 'light-font'
          ]"
          @click="register = false"
        >
          登录浪潮
        </span>
      </div>
      <div class="register-or-login" v-if="showForms">
        <div 
          :class="[
            'registration-container',
            !register || 'form-active'
          ]"
        >
          <span class="registration-title">创建账号</span>
          <registration-form
            :username="username"
            :email="email"
            v-on:registered="connect"
          />
        </div>
        <div
          :class="[
            'login-container',
            register || 'form-active'
          ]"
        >
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
        auth: {},
        register: true
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
      siteinfo () {
        let text = ''
        switch (this.site) {
          case 'twitter':
            text += `Twitter 账号 @${this.auth.profile.screen_name} `
            break
          case 'weibo':
            text += `微博账号 @${this.auth.profile.screen_name} `
        }

        return text
      }
    },
    methods: {
      async connect () {
        this.showForms = false
        try {
          await this.$axios.post('/auth', { authId: this.auth.id })
          this.$message.success(
            `你的账号${this.$store.getters.getClient.username}已与 ${this.siteinfo}绑定成功`
          )
          let path = this.$route.query.redirect || '/'
          if (path[0] !== '/') {
            path = '/' + path
          }
          this.$router.push(path)
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
      if (query.site === 'twitter') {
        path += `token=${query.token}&verifier=${query.verifier}`
      } else if (query.site === 'weibo') {
        path += `code=${query.code}&authId=${query.authId}`
      } else {
        redirect('/')
      }

      try {
        let response = await $axios.get(path)
        if ([200, 201].includes(response.status)) {
          await store.dispatch('getClient')
          let redirectUrl = '/'
          redirectUrl += query.redirect ? ((query.redirect[0] === '/')
            ? query.redirect.slice(1)
            : query.redirect) : ''
          redirect(
            redirectUrl,
            response.status === 200
              ? { status: 'logged_in_successfully' }
              : {
                status: 'authenticate_successfully',
                auth_name: response.data.profile.name
              }
          )
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

  .switch-form {
    width: 100%;
    display: none;
    justify-content: center;
    align-items: center;
    color: #888;
    margin-top: .5rem;
  }

  .switch-title {
    cursor: pointer;
  }

  .switch-form-divider {
    margin: 0 .5rem;
    user-select: none;
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
    width: 50%;
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
    height: 90%;
    width: 1px;
    background-color: #aaa;
    position: absolute;
    left: .25rem;
    margin: 5% 0;
  }

  .connecting {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .connecting * {
    font-size: 1rem !important;
  }

  @media (max-width: 600px) {
    .switch-form {
      display: flex;
    }

    .login-container, .registration-container, .divider,
      .login-title, .registration-title {
      display: none;
      width: 100%;
    }

    .form-active {
      display: flex;
      flex-direction: column;
      left: 0;
    }
  }
</style>
