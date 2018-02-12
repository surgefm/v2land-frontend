<template>
  <background>
    <card>
      <event-title>登录浪潮</event-title>
      <div class="form-container">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="80px"
          class="form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password" />
          </el-form-item>

          <div class="submit-button-group-separate">
            <div class="third-party">
              <span>第三方登录：</span>
              <i
                class="icon-twitter border-color icon-container"
                @click="loginTwitter"
              />
              <i
                class="icon-weibo border-color icon-container"
                @click="loginWeibo"
              />
            </div>
            <div>
              <el-button type="text" disabled>忘记密码</el-button>
              <el-button type="primary" @click="submit">登录</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </card>
    <logo class="logo" />
    <page-foot />
    <event-action />
  </background>
</template>

<script>
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
        return redirect || '/'
      }
    },
    methods: {
      submit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$axios.post('client/login', this.form, { withCredentials: true })
              .then(({ data }) => {
                this.$store.commit('setClient', data.client)
                this.$message.success('登录成功')
                this.$router.push(this.redirect)
              })
              .catch((err) => {
                this.$message.error(err.response.data.message)
              })
          }
        })
      },
      loginTwitter () {
        window.location = config.api + 'auth/twitter?redirect=' + this.redirect
      },
      loginWeibo () {
        window.location = config.api + 'auth/weibo?redirect=' + this.redirect
      }
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
</style>
