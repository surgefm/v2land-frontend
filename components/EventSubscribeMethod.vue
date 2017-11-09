<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="4.5rem">
      <el-form-item label="提醒方法" prop="method">
        <el-select
          v-model="form.method"
          placeholder="请选择通过什么方式提醒你"
          class="method-selector"
        >
          <el-option
            v-for="method in methodCollection"
            :key="method.value"
            :label="method.label"
            :value="method.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.method === 'email'" label="邮箱地址" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
    </el-form>


    <div class="submit-button-group-separate">
      <el-button type="primary" @click="lastStep">上一步</el-button>
      <div>
        <el-button v-if="showTwitter" @click="connectTwitter">
          绑定 Twitter 账号
        </el-button>
        <el-button v-else-if="showWeibo" @click="connectWeibo">
          绑定新浪微博账号
        </el-button>
        <el-button v-else type="primary" @click="submit" :disabled="!isSubmittable">
          {{ buttonText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '~/const'
  import $ from 'postman-url-encoder'
  import Cookie from 'cookie'

  export default {
    data () {
      return {
        form: {
          method: 'weibo',
          email: ''
        },
        rules: {
          method: [
            { required: true, message: '请选择提醒方法', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ]
        },
        methodCollection: [
          {
            label: '通过我的微博账号发布微博',
            value: 'weibo'
          },
          {
            label: '通过我的 Twitter 账号发推',
            value: 'twitter'
          },
          {
            label: '邮件推送',
            value: 'email'
          }
        ]
      }
    },
    computed: {
      showTwitter () {
        return this.form.method === 'twitter' &&
          !this.$store.getters.getAuth('twitter')
      },
      showWeibo () {
        return this.form.method === 'weibo' &&
          !this.$store.getters.getAuth('weibo')
      },
      buttonText () {
        let method = this.form.method
        let auth = this.$store.getters.getAuth(method)
        if (method === 'twitter') {
          this.$set(this.form, 'twitter', auth.profileId)
          return `使用 @${auth.profile.screen_name} 发推`
        } else if (method === 'weibo') {
          this.$set(this.form, 'weibo', auth.profileId)
          return `使用 @${auth.profile.screen_name} 发布微博`
        } else {
          return '下一步'
        }
      },
      isSubmittable () {
        return this.form.method && this.form[this.form.method]
      }
    },
    methods: {
      lastStep () {
        this.save()
        this.$emit('goToMode')
      },
      submit () {
        this.save()
        this.$emit('methodSelected')
      },
      save () {
        this.$store.commit('setSubscribeMethod', {
          method: this.form.method,
          address: this.form[this.form.method]
        })
      },
      connectTwitter () {
        let accessToken
        try {
          let cookies = Cookie.parse(document.cookie)
          accessToken = cookies.accessToken
        } catch (err) {}
        let url = $.encode(config.api + 'auth/twitter?r=' + Math.random() * 10000 +
          (accessToken ? '&access_token=' + accessToken : '') +
          '&redirect=' + this.$route.params.name + '/subscribe?' +
          'mode=' + this.$store.state.subscribe.mode)
        window.location = url
      },
      connectWeibo () {
        let accessToken
        try {
          let cookies = Cookie.parse(document.cookie)
          accessToken = cookies.accessToken
        } catch (err) {}
        let url = $.encode(config.api + 'auth/weibo?' +
          (accessToken ? 'access_token=' + accessToken + '&' : '') +
          'redirect=' + this.$route.params.name + '/subscribe?mode=' +
          this.$store.state.subscribe.mode)
        window.location = url
      }
    },
    created () {
      this.form.method = this.$route.query.method ||
        this.$store.state.subscribe.contact.method ||
        'weibo'
      this.form[this.form.method] = this.$route.query.address ||
        this.$store.state.subscribe.contact.address
    }
  }
</script>

<style scoped>
  .method-container {
    display: flex;
    align-items: center;
    margin-bottom: .5rem;
  }

  .method-container span {
    width: 5rem;
    margin-right: 1rem;
    text-align: right;
  }

  .method-selector {
    width: 100%;
  }

  .submit-button-group-separate {
    margin-top: 1rem;
  }
</style>
