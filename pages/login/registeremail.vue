<template>
  <background>
    <card>
      <event-title>注册浪潮</event-title>
      <div class="form-container">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="80px"
          class="form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>

          <div class="finish-button-group">
            <el-button type="primary" @click="submit">完成</el-button>
          </div>
        </el-form>
      </div>
    </card>

    <p class="finish-hint">注册已完成，请确认邮箱地址，否则将无法使用邮件提醒功能及新闻事件修改功能</p>

    <logo class="logo"></logo>
    <page-foot/>
  </background>
</template>

<script>
  import Cookie from 'cookie'
  import axios from '~/plugins/axios'
  import config from '~/const'

  export default {
    data () {
      return {
        form: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
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
      }
    },
    methods: {
      submit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            axios.post('clients/login', this.form)
              .then((res) => {
                let expireTime = new Date(new Date(res.data.created).getTime() + res.data.ttl * 1000)
                this.saveAccessToken(res.data.id, expireTime)
              })
              .catch(() => {
                this.$message.error('用户名或密码错误')
              })
          }
        })
      },
      saveAccessToken (token, expireTime) {
        try {
          let cookie = Cookie.serialize('accessToken', token, {
            expires: expireTime
          })

          document.cookie = cookie

          this.$message.success('登录成功')
          window.location.replace(window.location.origin + (this.$route.query.redirect || ''))
        } catch (err) {}
      },
      loginTwitter () {
        window.location = config.api + 'auth/twitter?redirect=' + this.redirect
      },
      loginWeibo () {
        window.location = config.api + 'auth/weibo?redirect=' + this.redirect
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        if (vm.$store.state.client.username) {
          vm.$message('你是已登录用户')
          vm.$router.push(vm.$route.query.redirect || '/')
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  .form-container {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form {
    width: 100%;
    max-width: 25rem;
  }

  .third-party {
    display: flex;
    align-items: center;
    color: #b4bccc;
    line-height: 1;
    font-size: 14px;
    font-weight: 500;
  }

  .border-color {
    padding: .4rem;
    margin: 0 .2rem;
    transition: all .2s;
    cursor: pointer;
    border: transparent .25rem solid;
    border-top: none;
    border-left: none;
    border-right: none;
    height: 2rem;
  }

  .icon-container {
    display: flex;
    align-items: center;
    border: none;
    font-size: 1.25rem;
  }

  .border-color:before {
    color: rgb(129, 207, 224);
    transition: all .2s;
  }

  .icon-weibo:hover:before {
    color: #e6162d;
  }

  .icon-twitter:hover:before {
    color: #1da1f2;
  }

  .el-form-item.is-required:before {
    content: ""
  }

  @media (max-width: 350px) {
    .third-party span {
      display: none;
    }
  }

  .finish-button-group {
    text-align: right;
  }

  .finish-hint {
    background-color: #6FCF97;
    padding: 9px;
    max-width: 530px;
  }
</style>
