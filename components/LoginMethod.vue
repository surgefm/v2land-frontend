<template>
  <div class="login-method">
    <div class="flex-container">
      <div class="method-item" v-if="availableMethods.includes('weibo')">
        <div @click="loginWeibo" class="item">
          <div class="oval red"> 
            <div class="inner-oval">
              <img width="64" height="52" :src="getSource('Sina_Weibo.svg')" />
            </div>
          </div>
          <div class="login-text weibo-login unselectable">微博登录</div>
        </div>
      </div>

      <div class="method-item" v-if="availableMethods.includes('twitter')">
        <div @click="loginTwitter" class="item">
          <div class="oval blue">
            <div class="inner-oval twitter">
              <i class="icon-twitter" />
            </div>
          </div>
          <div class="login-text twitter-login unselectable">Twitter 登录</div>
        </div>
      </div>

      <div class="method-item">
        <div @click="loginEmail" class="item">
          <div class="oval grey">
            <div class="inner-oval email">
              <logo mode="simple" class="email-logo" />
            </div>
          </div>
          <div class="login-text email-login unselectable">邮箱账号登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '~/const';

export default {
  props: {
    redirect: {
      type: String,
      default: '',
    },
    availableMethods: {
      type: Array,
      default: [],
    },
  },

  methods: {
    getSource(path) {
      const publicPath = config.publicPath;
      if (publicPath && publicPath.slice(-6) === '_nuxt/') {
        return publicPath.slice(0, -6) + path;
      }
      return (publicPath || '/') + path;
    },
    loginTwitter() {
      window.location = config.api + 'auth/twitter?redirect=' + this.redirect;
    },
    loginWeibo() {
      window.location = config.api + 'auth/weibo?redirect=' + this.redirect;
    },
    loginEmail() {
      let path = '/login/email';
      if (this.$route.query.redirect || this.redirect) {
        path += '?redirect=' + (this.$route.query.redirect || this.redirect);
      }
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
  .method-item {
    margin-bottom: 1rem;
  }

  .oval {
    display: inline-block;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    transition: all .2s;
  }

  .inner-oval {
    position: relative;
    margin-top: 5px;
    margin-left: 5px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .2s;
  }

  .inner-oval img, .inner-over i * {
    opacity: 1;
  }

  .red {
    background-color: rgba(222, 82, 67, .05);
  }

  .blue {
    background-color: rgba(29, 161, 242, .05);
  }

  .grey {
    background-color: rgba(136, 136, 136, .05);
  }

  .red .inner-oval {
    background-color: rgba(222, 82, 67, .1);
  }

  .red .inner-oval:hover {
    background-color: rgba(222, 82, 67, .2);
  }

  .blue .inner-oval {
    background-color: rgba(29, 161, 242, .1);
  }

  .blue .inner-oval:hover {
    background-color: rgba(29, 161, 242, .2);
  }

  .grey .inner-oval {
    background-color: rgba(136, 136, 136, .1);
  }

  .grey .inner-oval:hover {
    background-color: rgba(136, 136, 136, .15);
  }

  .login-method .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .login-text {
    text-align: center;
    font-size: 16px;
    line-height: 19px;
    margin-top: .5rem;
  }

  .weibo-login {
    color: #D43B34;
  }

  .twitter-login {
    color: #1D8DEE;
  }

  .email-login {
    color: #888;
  }

  .unselectable {
    user-select: none;
  }

  // To make the bird fly right at the center
  .inner-oval.twitter {
    text-align: center;
    padding-top: .35rem;
    padding-left: .15rem;
    font-size: 52px;
  }

  .email-logo {
    height: 3.5rem;
  }

  .flex-container {
    display: flex;
    flex-flow: row wrap;
    align-content: center;
    justify-content: space-around;
    margin-bottom: 12px;
  }
</style>
