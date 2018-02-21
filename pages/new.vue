<template>
  <background>
    <card>
      <p class="tag light-font">{{ $route.params.name }}</p>
      <event-title>创建事件</event-title>
      <event-information-form
        :data="'CreateEvent'"
        class="event-form"
        v-on:submit="submit"
        ref="event-form"
      />
    </card>
    <logo class="logo" />
    <page-foot />
    <event-action />
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
            .catch((err) => {
              if (err.response.status === 422) {
                this.$message.error('已有同名事件或同名事件已在审核队列中')
              }
              this.$refs['event-form'].resetForm()
              this.$refs['event-form'].resetButton()
            })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tag {
    font-size: .9rem;
    margin-right: .5rem;
  }

  .event-form {
    margin-top: 1rem;
  }
</style>
