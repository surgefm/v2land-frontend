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
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          @keyup.enter.native="submit"
        />
      </el-form-item>

      <div class="finish-button-group">
        <el-button type="primary" @click="submit">创建</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      username: String,
      password: String,
      email: String
    },
    data () {
      return {
        form: {
          username: '',
          email: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱', trigger: 'blur,change' }
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
            this.$axios.post('client/register', this.form)
              .then(async (res) => {
                this.$message.success('创建成功')
                await this.$store.dispatch('getClient')
                this.$emit('registered')
              })
              .catch(err => {
                this.$message.error(err.response.data.message)
              })
          }
        })
      }
    },
    created () {
      for (let i of ['username', 'password', 'email']) {
        this.$set(this.form, i, this[i] || this.form[i])
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

  .finish-button-group {
    text-align: right;
  }

  .finish-hint {
    background-color: #6FCF97;
    padding: 9px;
    max-width: 530px;
  }
</style>
