<template>
  <div>
    <subscribe-mode />
    <subscribe-method />
  </div>
</template>

<script>
  import EventSubscribeMode from '~/components/EventSubscribeMode'
  import EventSubscribeMethod from '~/components/EventSubscribeMethod'

  export default {
    components: {
      'subscribe-mode': EventSubscribeMode,
      'subscribe-method': EventSubscribeMethod
    },
    created () {
      let lastSubscription = this.$store.getters.getLastSubscription
      let query = this.$route.query
      if (query.data) {
        query.data = JSON.parse(decodeURIComponent(query.data))
        query = {
          ...query,
          ...query.data
        }
      }

      if (lastSubscription) {
        this.$store.commit('setSubscribeMode', lastSubscription.mode)
        this.$store.commit('setSubscribeMethod', lastSubscription.contact)
      }

      if (query.mode) {
        this.$store.commit('setSubscribeMode', query.mode)
      }

      if (query.method) {
        this.$store.commit('setSubscribeMethod', {
          method: query.method
        })
      }
    }
  }
</script>
