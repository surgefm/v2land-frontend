<template>
  <background>
    <card>
      <event-title>创建事件</event-title>
      <event-information-form
        :data="'CreateEvent'"
        class="event-form"
        v-on:submit="submit"
        ref="event-form"
      />
    </card>
    <page-foot />
  </background>
</template>

<script>
  import EventInformationForm from '~/components/EventInformationForm.vue';

  export default {
    components: {
      'event-information-form': EventInformationForm,
    },
    computed: {
      isAdmin() {
        return this.$store.getters.isClientAdmin;
      },
    },
    methods: {
      submit() {
        const data = this.$store.state.temp['CreateEvent'];
        if (this.isAdmin) {
          this.$store.dispatch('createEvent', { data })
            .then(() => {
              const { name } = data;
              this.$store.dispatch('fetchEvent', { name });
            })
            .then(() => {
              this.$message('创建成功');
              this.$router.push(`/${data.name}`);
            });
        } else {
          this.$store.dispatch('createEvent', { data })
            .then(() => {
              this.$message('提交成功，该事件会在审核通过后创建');
              this.$router.push('/');
            })
            .catch((err) => {
              if (err.response.status === 422) {
                this.$message.error('已有同名事件或同名事件已在审核队列中');
              }
              this.$refs['event-form'].resetForm();
              this.$refs['event-form'].resetButton();
            });
        }
      },
    },
    head() {
      return {
        title: '添加新事件 - 浪潮，你的社会事件追踪工具',
      };
    },
  };
</script>

<style lang="scss" scoped>
  .event-form {
    margin-top: 1rem;
  }
</style>
