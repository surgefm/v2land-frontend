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
  import Logo from '~/components/Logo.vue'
  import Background from '~/components/Background.vue'
  import Card from '~/components/Card.vue'
  import EventAction from '~/components/EventAction'
  import EventTitle from '~/components/EventTitle'
  import EventSubscribeStep from '~/components/EventSubscribeStep'
  import EventSubscribeMode from '~/components/EventSubscribeMode'
  import EventSubscribeMethod from '~/components/EventSubscribeMethod'
  import EventSubscribeSuccess from '~/components/EventSubscribeSuccess'

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
      Logo,
      Background,
      Card,
      'event-action': EventAction,
      'event-title': EventTitle,
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
        this.$message.success('关注成功')
        this.show = 'success'
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
