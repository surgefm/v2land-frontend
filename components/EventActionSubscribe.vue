<template>
  <nuxt-link
    class="subscribe-container"
    :to="'/' + this.$route.params.name + '/subscribe'"
  >
    <el-tooltip
      placement="top-end"
      popper-class="subscription-tooltip"
      :value="showTooltip"
      :manual="true"
    >
      <p slot="content" class="tooltip">
        <b>关注事件</b>后，我们会在获得最新消息时经邮件、微博、Twitter 等方式通知您
      </p>
      <div class="full-size">
        <img
          :src="config.static + 'icon.svg'"
          class="hidden-image"
          @load="activate"
        />
      </div>
    </el-tooltip>
    <span
      class="text light-font"
    >
      {{ subscribed ? '正在关注' : '关注事件' }}
    </span>
    <i class="icon el-icon-bell light-font" />
  </nuxt-link>
</template>

<script>
  import config from '~/const'
  import Cookie from 'js-cookie'

  export default {
    data () {
      return {
        subscribed: false,
        showTooltip: false,
        config
      }
    },
    methods: {
      activate () {
        Cookie.remove('v2land-isSubscriptionTooltipShown')
        if (this.$route.name === 'name-subscribe' &&
          this.$store.getters.getClient.subscriptions[0]) {
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
      }
    },
    created () {
      if (this.$store.getters.getEventSubscriptionList(
        this.$route.params.name
      )) {
        this.subscribed = true
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
