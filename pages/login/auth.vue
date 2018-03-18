<template>
  <background>
    <card class="auth-container">
      <event-title>绑定账号</event-title>
      <span v-if="mode === 'registerOrLogin'">
        {{ siteinfo }}连接成功，请创建或登录浪潮账号以完成绑定。
      </span>
      <div class="switch-form" v-if="mode === 'registerOrLogin'">
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
      <div class="register-or-login" v-if="mode === 'registerOrLogin'">
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
      <span v-if="mode === 'switchAccount'" class="switch-account">
        {{ siteinfo }}已于浪潮账号「{{ conflictClient }}」绑定，是否解绑并与您现在的账号绑定？
      </span>
      <div v-if="mode === 'switchAccount'" class="submit-button-group-separate">
        <el-button @click="$router.push(redirect)">取消</el-button>
        <el-button type="primary" @click="connect">确定解绑</el-button>
      </div>
      <div v-if="mode === 'loading'" class="connecting">
        <logo mode="simple" />
        <span>正在绑定</span>
      </div>
    </card>

    <page-foot />
  </background>
</template>

<script>
  import RegistrationForm from '~/components/RegistrationForm.vue';
  import LoginForm from '~/components/LoginForm.vue';
  import $ from 'postman-url-encoder';

  export default {
    data() {
      return {
        mode: 'loading',
        username: null,
        email: null,
        site: null,
        auth: {},
        conflictClient: null,
        register: true,
      };
    },
    computed: {
      redirect() {
        let path = this.$route.query.redirect || '/';
        if (path[0] !== '/') {
          path = '/' + path;
        }
        return path;
      },
      siteinfo() {
        let text = '';
        switch (this.site) {
        case 'twitter':
          text += `Twitter 账号 @${this.auth.profile.screen_name} `;
          break;
        case 'weibo':
          text += `微博账号 @${this.auth.profile.screen_name} `;
        }

        return text;
      },
    },
    methods: {
      async connect() {
        this.mode = 'connecting';
        try {
          await this.$axios.post('/auth', { authId: this.auth.id });
          this.$message.success(
            `你的账号${this.$store.getters.getClient.username}已与 ${this.siteinfo}绑定成功`
          );
          await this.$store.dispatch('getClient');
          this.$router.push(this.redirect);
        } catch (err) {
          this.$message.error(err);
          this.$router.push({
            path: 'login',
            query: {
              redirect: this.$route.query.redirect,
            },
          });
        }
      },
    },
    components: {
      'registration-form': RegistrationForm,
      'login-form': LoginForm,
    },
    async asyncData({ $axios, query, redirect, store }) {
      let path = `auth/${query.site}/redirect?`;
      if (query.site === 'twitter') {
        path += `token=${query.token}&verifier=${query.verifier}`;
      } else if (query.site === 'weibo') {
        path += `code=${query.code}&authId=${query.authId}`;
      } else {
        redirect('/');
      }

      try {
        const response = await $axios.get(path);
        if ([200, 201].includes(response.status)) {
          await store.dispatch('getClient');
          let redirectUrl = '/';
          redirectUrl += query.redirect ? ((query.redirect[0] === '/')
            ? query.redirect.slice(1)
            : query.redirect) : '';
          redirectUrl += redirectUrl.includes('?') ? '&' : '?';
          if (response.status === 200) {
            redirectUrl += 'status=logged_in_successfully';
          } else {
            redirectUrl += `status=authenticate_successfully&auth_name=${response.data.profile.name}`;
          }
          redirect($.encode(redirectUrl));
        } else if (response.status === 202 &&
          response.data.name === 'authentication required') {
          return {
            mode: 'registerOrLogin',
            username: response.data.auth.profile.name,
            site: query.site,
            auth: response.data.auth,
          };
        } else if (response.status === 202 &&
          response.data.name === 'already connected') {
          return {
            mode: 'switchAccount',
            username: response.data.auth.profile.name,
            site: query.site,
            auth: response.data.auth,
            conflictClient: response.data.conflict,
          };
        }
      } catch (err) {
        redirect('/login', {
          status: 'auth_failed',
          redirect: query.redirect,
        });
      }
    },
    head() {
      return {
        title: '绑定第三方账户',
      };
    },
  };
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

  .switch-account {
    margin-bottom: 1rem;
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
