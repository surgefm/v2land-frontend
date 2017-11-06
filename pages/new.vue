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
    computed: {
      isAdmin () {
        return this.$store.getters.isClientAdmin
      }
    },
    methods: {
      submit () {
        let data = this.$store.state.temp['CreateEvent']
        if (this.isAdmin) {
          this.$store.dispatch('createEvent', { data })
            .then(() => {
              this.$store.dispatch('fetchEvent', data.name)
            })
            .then(() => {
              this.$message('创建成功')
              this.$router.push(`/${data.name}`)
            })
        } else {
          this.$store.dispatch('createEvent', { data })
            .then(() => {
              this.$message('提交成功，该事件会在审核通过后创建')
              this.$router.push('/')
            })
        }
      }
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
