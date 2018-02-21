<template>
  <background>
    <card>
      <div class="submit-button-group-separate">
        <event-title>用户信息</event-title>
        <i
          class="el-icon-edit edit"
          @click="isEditting = !isEditting"
        />
      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :class="['form', isEditting || 'view']"
      >
        <el-form-item label="用户名">
          <span v-if="!isEditting">{{ form.username }}</span>
          <el-input v-else v-model="form.username" />
        </el-form-item>
        <el-form-item label="用户组">
          <span v-if="!isEditting">{{ role }}</span>
          <el-input v-else v-model="role" disabled />
        </el-form-item>
        <el-form-item label="邮箱">
          <span v-if="!isEditting">{{ form.email }}</span>
          <el-input v-else v-model="form.email" disabled />
        </el-form-item>
        <el-form-item
          v-for="auth of form.auths"
          :key="auth.site + auth.profileId"
          :label="authInfo(auth).site"
        >
          <span>{{ authInfo(auth).username }}</span>
          <el-button
            type="text"
            v-if="isEditting"
            class="disconnect"
            @click="unauthorize(auth)"
          >
            解除绑定
          </el-button>
        </el-form-item>
        <el-form-item v-if="showConnectTwitter" label="Twitter">
          <el-button
            size="small"
            type="primary"
            class="connect"
            plain
            @click="connectTwitter">
            <i class="icon-twitter" />
            绑定 Twitter
          </el-button>
        </el-form-item>
        <el-form-item v-if="showConnectWeibo" label="新浪微博">
          <el-button
            size="small"
            type="danger"
            class="connect"
            plain
            @click="connectWeibo"
          >
            <i class="icon-weibo" />
            绑定新浪微博
          </el-button>
        </el-form-item>
      </el-form>
      <div class="submit-button-group" v-if="isEditting">
        <el-button disabled>保存修改</el-button>
      </div>
    </card>
    <logo class="logo" />
    <event-action />
    <page-foot />
  </background>
</template>

<script>
  import config from '~/const'

  export default {
    data () {
      return {
        form: {
          username: '',
          role: '',
          email: '',
          authList: []
        },
        isEditting: false
      }
    },
    computed: {
      client () {
        return this.$store.getters.getClient
      },
      role () {
        switch (this.form.role) {
          case 'admin':
            return '超级管理员'
          case 'manager':
            return '管理员'
          case 'contributor':
            return '协作者'
          default:
            return '浪潮用户'
        }
      },
      showConnectTwitter () {
        if (!this.client.auths) {
          return 0
        }
        return (this.client.auths.filter(a => a.site === 'twitter').length < 1)
      },
      showConnectWeibo () {
        if (!this.client.auths) {
          return 0
        }
        return (this.client.auths.filter(a => a.site === 'weibo').length < 1)
      },
      isUnauthorizable () {
        let isClientHavingEmail = false
        if (!this.client.email.includes('.langchao.co') &&
          this.client.emailVerified) {
          isClientHavingEmail = true
        }

        return (this.client.auths.length > 1 || isClientHavingEmail)
      },
      redirect () {
        return config.baseUrl + 'login/auth?redirect=/me'
      }
    },
    methods: {
      authInfo (auth) {
        if (auth.profile) {
          switch (auth.site) {
            case 'weibo':
              return {
                site: '新浪微博',
                username: '@' + auth.profile.screen_name
              }
            case 'twitter':
              return {
                site: 'Twitter',
                username: '@' + auth.profile.screen_name
              }
          }
        }

        return {}
      },
      updateForm () {
        this.$set(this, 'form', this.client)
        if ((this.form.username || '').includes(':')) {
          this.$set(this.form, 'username', '未设定')
        }
        if ((this.form.email || '').includes('.langchao.co')) {
          this.$set(this.form, 'email', '未设定')
        }
      },
      async unauthorize (auth) {
        if (this.isUnauthorizable) {
          try {
            await this.$axios.delete(`auth/${auth.id}`)
            await this.$store.dispatch('getClient')
            this.updateForm()
            this.$message.success('解绑成功')
          } catch (err) {
            this.$message.error('解绑失败')
          }
        } else {
          this.$message('你必须验证邮箱或绑定超过一个第三方账号方可解绑')
        }
      },
      connectTwitter () {
        window.location = config.api + 'auth/twitter?redirect=' + this.redirect
      },
      connectWeibo () {
        window.location = config.api + 'auth/weibo?redirect=' + this.redirect
      }
    },
    created () {
      this.updateForm()
    }
  }
</script>

<style lang="scss" scoped>
  .edit {
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .edit:hover {
    color: #888;
  }

  .form {
    margin-top: 1rem;
  }

  .view .el-form-item {
    margin-bottom: 0;
  }

  .disconnect {
    margin-left: .5rem;
  }

  .icon-twitter,
  .icon-weibo {
    font-size: 14px;
    margin-right: .125rem;
    transition: all .1s;
  }

  .connect:hover i:before,
  .connect:active i:before {
    color: #fff !important;
  }
</style>
