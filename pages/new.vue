<template>
  <background>
    <card>
      <p class="tag light-font">{{ $route.params.name }}</p>
      <event-title>新建事件</event-title>
      <event-information-form
        :data="'CreateEvent'"
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
        let data = this.$store.state.temp['CreateEvent']
        this.$store.dispatch('createEvent', { data })
          .then(() => {
            this.$store.dispatch('fetchEvent', this.$route.params.name)
          })
          .then(() => {
            this.$message('创建成功')
            this.$router.push(`/${this.$route.params.name}`)
          })
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        if (!vm.$store.getters.isClientAdmin) {
          vm.$message.error('你无权访问该页面')
          vm.$router.push('/')
        }
      })
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
