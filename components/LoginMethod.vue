<template>
  <div class="login-method">
    <div class="flex-container">
      <div class="method-item">
        <div @click="loginWeibo" class="item">
          <div class="oval red"> 
            <div class="inner-oval">
              <img width="64" height="52" src="~/static/Sina_Weibo.svg" />
            </div>
          </div>
          <div class="weibo-login unselectable">微博登录</div>
        </div>
      </div>

      <div class="method-item">
        <div @click="loginTwitter" class="item">
          <div class="oval blue">
            <div class="inner-oval twitter">
              <i class="icon-twitter" />
            </div>
          </div>
          <div class="twitter-login unselectable">Twitter 登录</div>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div @click="loginEmail" class="email-login">使用用户名/邮箱登录</div>
    </div>
  </div>
</template>

<script>
import config from '~/const'

export default {
  props: {
    redirect: {
      type: String,
      default: ''
    }
  },

  methods: {
    loginTwitter () {
      window.location = config.api + 'auth/twitter?redirect=' + this.redirect
    },
    loginWeibo () {
      window.location = config.api + 'auth/weibo?redirect=' + this.redirect
    },
    loginEmail () {
      this.$router.push('/login/email')
    }
  }
}
</script>

<style scoped>
  .oval {
    display: inline-block;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    transition: all .2s;
  }

  .inner-oval {
    position: absolute;
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

  .oval.red {
    background-color: rgba(222, 82, 67, .05);
  }

  .oval.blue {
    background-color: rgba(29, 161, 242, .05);
  }

  .oval.red .inner-oval {
    background-color: rgba(222, 82, 67, .1);
  }

  .oval.red .inner-oval:hover {
    background-color: rgba(222, 82, 67, .2);
  }

  .oval.blue .inner-oval {
    background-color: rgba(29, 161, 242, .1);
  }

  .oval.blue .inner-oval:hover {
    background-color: rgba(29, 161, 242, .2);
  }

  .login-method table {
    width: 100%;
  }

  .login-method table td {
    text-align: center;
  }

  .login-method .item {
    display: inline-block;
    cursor: pointer;
  }

  .weibo-login {
    display: block;
    text-align: center;
    font-size: 16px;
    line-height: 19px;
    color: #D43B34;
  }

  .twitter-login {
    display: block;
    text-align: center;
    font-size: 16px;
    line-height: 19px;
    color: #1D8DEE;
  }

  .email-login {
    font-size: 14px;
    line-height: 16px;
    color: #A5AEC1;
  }

  .login-method .bottom {
    text-align: right;
  }

  .login-method .bottom .email-login {
    display: inline-block;
    cursor: pointer;
  }

  /* https://stackoverflow.com/questions/924916/is-there-a-way-to-make-a-div-unselectable */
  .unselectable {
    user-select: none;
  }

  .inner-oval.twitter {
    text-align: center;
    font-size: 52px;
  }

  .flex-container {
    display: flex;
    flex-flow: row wrap;
    align-content: center;
    justify-content: space-around;
    margin-bottom: 12px;
  }
</style>
