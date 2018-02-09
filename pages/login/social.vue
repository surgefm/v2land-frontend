<template>
  <background>
    <card>
      <event-title>登录浪潮</event-title>
      <div class="form-container">
        <p class="hint"><span class="green-sign">√</span>已成功使用微博/twitter登录，请设置浪潮社区昵称及邮箱</p>
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="80px"
          class="form"
        >
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>

          <div class="submit-button-group-separate">
            <div class="login-exist">
              <span @click="loginExist">登录已有帐号</span>
            </div>
            <div>
              <el-button type="primary" @click="submit">登录</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </card>

    <p class="finish-hint">注册已完成，请确认邮箱地址，否则将无法使用邮件提醒功能及新闻事件修改功能</p>

    <logo class="logo" />
    <page-foot />
    <event-action />
  </background>
</template>

<script>
  import Cookie from 'cookie'
  import axios from '~/plugins/axios'

  export default {
    data () {
      return {
        form: {
          nickname: '',
          email: '',
          password: ''
        },
        rules: {
          nickname: [
            { required: true, message: '请输入昵称', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' }
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
      loginExist () {
        window.location.href = '/login'
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

  .form-container .hint {
    margin-bottom: 1rem;
  }

  .green-sign {
    color: #239653;
  }

  .form {
    width: 100%;
    max-width: 25rem;
  }

  .login-exist {
    display: flex;
    align-items: center;
    color: #b4bccc;
    line-height: 1;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
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

  .finish-hint {
    background-color: #6FCF97;
    padding: 9px;
    max-width: 530px;
  }
</style>
