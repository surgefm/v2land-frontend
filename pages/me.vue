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
        <el-form-item
          v-for="auth of form.authList"
          :key="auth.site + auth.profileId"
          :label="authInfo(auth).site"
        >
          <span>{{ authInfo(auth).username }}</span>
          <el-button
            type="text"
            v-if="isEditting"
            class="disconnect"
            disabled
          >
            解除绑定
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
  export default {
    data () {
      return {
        form: {
          username: '',
          role: '',
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
      }
    },
    created () {
      this.$set(this, 'form', this.client)
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        if (!vm.$store.getters.isLoggedIn) {
          vm.$router.push('/login?redirect=/me')
          vm.$message('未登录用户无法查看此页面')
        }
      })
    }
  }
</script>

<style>
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
</style>
