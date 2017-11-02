<template>
  <background>
    <card>
      <p class="tag light-font">{{ $route.params.name }}</p>
      <event-title>关注事件</event-title>
      <event-subscribe-step class="margin-top" :step="step"></event-subscribe-step>
      <event-subscribe-mode
        class="margin-top"
        v-on:modeSelected="goToMethod"
        v-if="show === 'mode'"
      >
      </event-subscribe-mode>

      <event-subscribe-method
        class="margin-top"
        v-on:goToMode="goToMode"
        v-on:methodSelected="submit"
        v-if="show === 'method'"
      >
      </event-subscribe-method>

      <event-subscribe-success
        class="margin-top"
        v-if="show === 'success'"
      >
      </event-subscribe-success>
    </card>
    <event-action></event-action>
    <logo class="logo"></logo>
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
          })
      }
    }
  }
</script>

<style scoped>
  .tag {
    font-size: .9rem;
  }

  .margin-top {
    margin-top: 1rem;
  }
</style>
