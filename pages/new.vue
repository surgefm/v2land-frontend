<template>
  <background>
    <card>
      <div class="title-container">
        <event-title>创建事件</event-title>
        <autoformatting-switch
          v-model="autoFormatting"
          style="padding-top: 8px"
        />
      </div>
      <event-information-form
        ref="event-form"
        :data="'CreateEvent'"
        :auto-formatting="autoFormatting"
        class="event-form"
        @submit="submit"
      />
    </card>
    <page-foot />
  </background>
</template>

<script>
import EventInformationForm from '~/components/EventInformationForm.vue';
import AutoFormattingSwitch from '~/components/AutoFormattingSwitch.vue';

export default {
  components: {
    'autoformatting-switch': AutoFormattingSwitch,
    'event-information-form': EventInformationForm,
  },
  data() {
    return {
      autoFormatting: true,
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isClientAdmin;
    },
  },
  methods: {
    async submit() {
      const data = this.$store.state.temp['CreateEvent'];
      try {
        if (this.isAdmin) {
          await this.$store.dispatch('createEvent', { data });
          const { name } = data;
          const event = await this.$store.dispatch('fetchEvent', { name });
          this.$message('创建成功');
          this.$router.push(`/${event.id}`);
        } else {
          await this.$store.dispatch('createEvent', { data });
          this.$message('提交成功，该事件会在审核通过后创建');
          this.$router.push('/');
        }
      } catch (err) {
        if (err.response.status === 422) {
          this.$message.error('已有同名事件或同名事件已在审核队列中');
        }
        this.$refs['event-form'].resetForm();
        this.$refs['event-form'].resetButton();
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
  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .event-form {
    margin-top: 1rem;
  }
</style>
