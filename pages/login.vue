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
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>

          <div class="submit-button-group">
            <el-button type="text" disabled>忘记密码</el-button>
            <el-button type="primary" @click="submit">登录</el-button>
          </div>
        </el-form>
      </div>
    </card>
    <logo class="logo"></logo>
    <page-foot/>
  </background>
</template>

<script>
  import Cookie from 'cookie'
  import axios from '~/plugins/axios'

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
    methods: {
      submit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            axios.post('clients/login', this.form)
              .then((res) => {
                let cookie = Cookie.serialize('accessToken', res.data.id, {
                  expires: new Date(new Date(res.data.created).getTime() + res.data.ttl * 1000)
                })

                document.cookie = cookie

                this.$message.success('登录成功')
                window.location.replace(window.location.origin + (this.$route.query.redirect || ''))
              })
              .catch(() => {
                this.$message.error('用户名或密码错误')
              })
          }
        })
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

<style scoped>
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

  .el-form-item.is-required:before {
    content: ""
  } 
</style>
