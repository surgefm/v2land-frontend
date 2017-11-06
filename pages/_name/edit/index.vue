<template>
  <background>
    <card>
      <p class="tag light-font">{{ $route.params.name }}</p>
      <event-title>修改事件</event-title>
      <event-information-form
        mode="edit"
        :data="'EditEvent-' + $route.params.name"
        :name="$route.params.name"
        class="event-form"
        v-on:submit="submit"
      >
      </event-information-form>
    </card>
    <event-action></event-action>
    <logo class="logo"></logo>
    <page-foot/>
  </background>
</template>

<script>
  import EventInformationForm from '~/components/EventInformationForm.vue'

  export default {
    components: {
      'event-information-form': EventInformationForm
    },
    methods: {
      submit () {
        let data = this.$store.state.temp['EditEvent-' + this.$route.params.name]
        this.$store.dispatch('editEvent', {
          name: this.$route.params.name,
          data
        })
          .then(() => {
            this.$store.dispatch('fetchEvent', this.$route.params.name)
          })
          .then(() => {
            this.$message('修改成功')
            let url = this.$route.query.redirect || `/${this.$route.params.name}`
            this.$router.push(url)
          })
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        if (!vm.$store.getters.isClientAdmin) {
          vm.$message.error('你无权访问该页面')
          vm.$router.push('/' + vm.$route.params.name)
        }
      })
    },
    async asyncData ({ route, store }) {
      return store.dispatch('getEvent', route.params.name)
    }
  }
</script>

<style scoped>
  .tag {
    font-size: .9rem;
    margin-right: .5rem;
  }

  .event-form {
    margin-top: 1rem;
  }
</style>
