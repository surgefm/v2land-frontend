<template>
  <background>
    <card>
      <p class="tag light-font">{{ $route.params.name }}</p>
      <event-title>关注事件</event-title>
      <event-subscribe-step class="margin-top" :step="step" />
      <event-subscribe-mode
        class="margin-top"
        v-on:modeSelected="goToMethod"
        v-if="show === 'mode'"
      />

      <event-subscribe-method
        class="margin-top"
        v-on:goToMode="goToMode"
        v-on:methodSelected="submit"
        v-if="show === 'method'"
      />

      <event-subscribe-success
        class="margin-top"
        v-if="show === 'success'"
      />
    </card>
    <event-action />
    <logo class="logo" />
    <page-foot />
  </background>
</template>

<script>
  import EventSubscribeStep from '~/components/EventSubscribeStep'
  import EventSubscribeMode from '~/components/EventSubscribeMode'
  import EventSubscribeMethod from '~/components/EventSubscribeMethod'
  import EventSubscribeSuccess from '~/components/EventSubscribeSuccess'

  import axios from '~/plugins/axios'
  import $ from 'postman-url-encoder'

  export default {
    data () {
      return {
        show: 'mode'
      }
    },
    computed: {
      step () {
        switch (this.show) {
          case 'mode': return 0
          case 'method': return 1
          case 'success': return 2
        }
      },
      name () {
        return this.$route.params.name
      }
    },
    components: {
      'event-subscribe-step': EventSubscribeStep,
      'event-subscribe-mode': EventSubscribeMode,
      'event-subscribe-method': EventSubscribeMethod,
      'event-subscribe-success': EventSubscribeSuccess
    },
    methods: {
      goToMode () {
        this.show = 'mode'
      },
      goToMethod () {
        this.show = 'method'
      },
      submit () {
        let url = $.encode(`events/${this.$route.params.name}/subscribe`)
        axios.post(url, {
          mode: this.$store.state.subscribe.mode,
          contact: this.$store.state.subscribe.contact
        })
          .then(() => {
            this.show = 'success'
            this.$store.commit('setSubscribeMode', '')
            this.$store.commit('setSubscribeMethod', { method: '', address: '' })
            this.$store.dispatch('getClient')
          })
      }
    },
    created () {
      let lastSubscription = this.$store.getters.getLastSubscription

      if (this.$route.query.mode) {
        this.$store.commit('setSubscribeMode', this.$route.query.mode)
      }

      if (this.$route.query.method &&
        (this.$route.query[this.$route.query.method + '_id'])) {
        this.$store.commit('setSubscribeMethod', {
          method: this.$route.query.method,
          address: this.$route.query[this.$route.query.method + '_id']
        })
      }

      // 针对第三方账户跳转回来的情况，如果信息都已齐全，那就直接提交
      if (this.$route.query.mode &&
        this.$route.query.method &&
        this.$route.query[this.$route.query.method + '_id']) {
        this.submit()
      } else if (lastSubscription) {
        this.$store.commit('setSubscribeMode', lastSubscription.mode)
        this.$store.commit('setSubscribeMethod', lastSubscription.contact)
      } else if (this.$store.state.subscribe.mode) {
        this.show = 'method'
      }
    },
    head () {
      return {
        title: '关注' + this.name,
        meta: [
          { hid: 't:title', name: 'twitter:title', content: '关注' + this.name },
          { hid: 'og:title', property: 'og:title', content: '关注' + this.name },
          { hid: 't:description', name: 'twitter:description', content: `使用浪潮关注${this.name}，定期获取事件动态` },
          { hid: 'og:description', property: 'og:description', content: `使用浪潮关注${this.name}，定期获取事件动态` },
          { hid: 't:image', name: 'twitter:image', content: 'https://s.langchao.co/twitter-icon.png' },
          { hid: 'og:image', property: 'og:image', content: 'https://s.langchao.co/twitter-icon.png' },
          { hid: 't:card', name: 'twitter:card', content: 'summary' }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tag {
    font-size: .9rem;
  }

  .margin-top {
    margin-top: 1rem;
  }
</style>
