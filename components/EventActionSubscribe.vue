<template>
  <div>
    <div
      :class="['subscribe-container', !tabLoading || 'disabled-tab']"
      :to="'/' + this.$route.params.name + '/subscribe'"
      @click="openDialog"
      v-loading="tabLoading"
    >
      <el-tooltip
        placement="top-end"
        :value="showTooltip"
        :manual="true"
      >
        <div slot="content" class="tooltip">
          <p class="large-screen">
            <b>关注事件</b>后，我们会在获得最新消息时经邮件、微博、Twitter 等方式通知您
          </p>
          <p class="small-screen">
            通过邮件／微博获取最新消息
          </p>
        </div>
        <div class="full-size">
          <img
            :src="config.static + 'icon.svg'"
            class="hidden-image"
            @load="activate"
          />
        </div>
      </el-tooltip>
      <span class="text light-font">
        {{ subscribed ? '正在关注' : '关注事件' }}
      </span>
      <i class="icon el-icon-bell light-font" />
    </div>

    <el-dialog
      title="关注事件"
      :visible.sync="showDialog"
      :modal-append-to-body="false"
    >
      <div v-if="!$store.getters.isLoggedIn">
        <p class="center light-font">关注事件前请先登录</p>
        <login-method
          :availableMethods="availableMethods"
          :redirect="redirect"
        />
      </div>
      <event-subscribe v-else-if="!showEditButton" />
      <div v-else>
        <span>
          你已成功关注 
          <span class="text-underline">{{ $route.params.name }}</span>
          ，我们会在获得最新消息时通过邮箱的方式通知你。
        </span>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <span v-if="!isSubmittable">
          
        </span>
        <el-button
          @click="editSubscription"
          v-if="showEditButton"
        >
          添加其他关注方式
        </el-button>
        <el-button
          type="primary"
          @click="submit"
          :disabled="!showEditButton && !isSubmittable"
          :loading="submitting"
        >
          {{
            showEditButton
              ? '确 认'
              : (isSubmittable ? '添加关注' : '您已有相同的关注方式')
          }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import config from '~/const'
  import Cookie from 'js-cookie'
  import $ from 'postman-url-encoder'
  import EventSubscribe from '~/components/EventSubscribe.vue'

  export default {
    data () {
      return {
        availableMethods: [],
        subscribed: false,
        showTooltip: false,
        showDialog: false,
        showEditButton: true,
        tabLoading: false,
        submitting: false,
        config
      }
    },
    computed: {
      redirect () {
        let redirect = config.baseUrl + 'login/auth?redirect='
        return redirect + `${this.$route.path}?subscribe=1`
      },
      subscriptions () {
        return this.$store.getters.getEventSubscriptionList(
          this.$route.params.name
        )
      },
      isSubmittable () {
        let { mode, contact } = this.$store.state.subscribe
        let subscription = this.subscriptions.filter(s => {
          let method = 'email'
          if (s.contact.method.includes('weibo')) {
            method = 'weibo'
          } else if (s.contact.method.includes('twitter')) {
            method = 'twitter'
          }

          return s.mode === mode &&
            s.contact.method === contact.method &&
            s.contact[method] === contact[method]
        })
        return subscription.length === 0
      }
    },
    methods: {
      activate () {
        if (this.$route.query.subscribe === '1') {
          this.showDialog = true
        }

        if (this.$store.getters.getClient.subscriptions[0] ||
          this.showDialog) {
          return
        }
        if (!Cookie.get('v2land-isSubscriptionTooltipShown')) {
          this.showTooltip = true
          setTimeout(() => {
            this.showTooltip = false
          }, 6000)
          setTimeout(() => {
            Cookie.set('v2land-isSubscriptionTooltipShown', 1, {
              expires: 60 * 60 * 24 * 3
            })
          }, 3000)
        }
      },
      editSubscription () {
        this.showEditButton = false
      },
      async openDialog () {
        if (this.tabLoading) return
        if (this.$store.getters.isLoggedIn) {
          let subscription = this.subscriptions.filter(s => {
            return s.mode === 'new' && s.contact.method === 'email'
          })
          if (!this.subscriptions[0] && subscription.length === 0) {
            this.tabLoading = true
            let url = $.encode(`subscription/${this.$route.params.name}`)
            await this.$axios.post(url, {
              mode: 'new',
              contact: {
                method: 'email',
                email: this.$store.getters.getClient.email
              }
            })
            await this.$store.dispatch('getClient')
            this.tabLoading = false
          }
        }

        this.showDialog = true
        this.showTooltip = false
      },
      closeDialog () {
        this.showDialog = false
        this.showEditButton = true
      },
      async submit () {
        if (this.showEditButton) {
          this.closeDialog()
        } else {
          try {
            this.submitting = true
            let { mode, contact } = this.$store.state.subscribe
            let url = $.encode(`subscription/${this.$route.params.name}`)
            await this.$axios.post(url, { mode, contact })
            this.closeDialog()
            this.$message.success('关注成功')
            this.$store.commit('setSubscribeMode', '')
            this.$store.commit('setSubscribeMethod', { method: '', address: '' })
            await this.$store.dispatch('getClient')
            this.submitting = false
          } catch (err) {
            this.$message.error(err.message || '发生了未知错误')
            this.submitting = false
          }
        }
      }
    },
    components: {
      'event-subscribe': EventSubscribe
    },
    async created () {
      if (this.$store.getters.getEventSubscriptionList(
        this.$route.params.name
      )[0]) {
        this.subscribed = true
      }

      if (this.$route.query.edit === '1') {
        this.showEditButton = false
      }

      if (!this.$store.getters.isLoggedIn) {
        let methods = await this.$store.dispatch('getAvailableAuthMethod')
        this.availableMethods = methods.slice()
        this.showEditButton = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .full-size {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .center.light-font {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .hidden-image {
    visibility: hidden;
    width: 0;
    height: 0;
  }

  .tooltip, .tooltip * {
    max-width: 16rem;
    line-height: 1.35;
    font-size: .8rem;
    text-align: center;
    user-select: none;
  }
</style>
