<template>
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
        <el-input
          type="password"
          v-model="form.password"
          @keyup.enter.native="submit"
        />
      </el-form-item>

      <div class="submit-button-group-separate">
        <div v-if="authorizing || $store.getters.getAvailableAuths.length <= 1" />
        <a v-else class="third-party" @click="thirdParty">
          第三方账号登录
        </a>
        <div>
          <el-button
            type="text"
            disabled
            v-if="!authorizing"
          >
            忘记密码
          </el-button>
          <el-button
            type="primary"
            @click="submit"
            :loading="isSubmitting"
          >
            登录
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      hideThirdParty: Boolean,
      hideFindPassword: Boolean,
      authorizing: Boolean
    },
    data () {
      return {
        form: {
          username: '',
          password: ''
        },
        isSubmitting: false,
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
            this.isSubmitting = true
            this.$axios.post('client/login', this.form)
              .then(({ data }) => {
                this.$store.commit('setClient', data.client)
                this.$ga.set('userId', data.client.id)
                this.$message.success(`你好，${data.client.username}`)
                if (this.authorizing) {
                  this.$emit('logged-in')
                } else {
                  this.$router.push(this.redirect)
                }
                this.isSubmitting = false
              })
              .catch((err) => {
                this.$message.error(err.response.data.message)
                this.isSubmitting = false
              })
          }
        })
      },
      thirdParty () {
        let path = '/login'
        if (this.$route.query.redirect) {
          path += '?redirect=' + this.$route.query.redirect
        }
        this.$router.push(path)
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

  .el-form-item.is-required:before {
    content: ""
  }

  @media (max-width: 350px) {
    .third-party span {
      display: none;
    }
  }
</style>
