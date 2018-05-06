<template>
  <background>
    <card>
      <p class="tag light-font">{{ name }}</p>
      <event-title>管理事件</event-title>
      <div class="sorter">修改基本信息</div>
      <event-information-form
        mode="edit"
        :data="'EditEvent-' + name"
        :name="name"
        :hideButtons="true"
        class="event-form"
        ref="information"
      />
      <div class="divider" />
      <div class="sorter">修改事件题图</div>
      <event-image-form
        ref="image"
        :name="name"
        :hideButtons="true"
      />
      <div class="submit-button-group">
        <el-button type="text" @click="reset">重置表单</el-button>
        <el-button
          type="primary"
          @click="submit"
        >
          提交
        </el-button>
      </div>
    </card>
    <page-foot />
  </background>
</template>

<script>
  import EventInformationForm from '~/components/EventInformationForm.vue';
  import EventImageForm from '~/components/EventCard/EventImageForm.vue';

  export default {
    components: {
      'event-information-form': EventInformationForm,
      'event-image-form': EventImageForm,
    },
    computed: {
      name() {
        return this.event.name;
      },
      event() {
        return this.$store.getters.getEvent(this.$route.params.name);
      },
    },
    methods: {
      async submit() {
        const info = await this.$refs.information.submitForm();
        const image = await this.$refs.image.submit();
        if (info) {
          const data = this.$store.state.temp['EditEvent-' + this.$route.params.name];
          this.$store.dispatch('editEvent', {
            name: this.$route.params.name,
            data,
          })
            .then(() => {
              const { name } = this.$route.params;
              this.$store.dispatch('fetchEvent', { name });
            })
            .then(() => {
              this.$message.success('修改成功');
              this.$refs.information.submitted();
            })
            .catch((err) => {
              console.error(err);
              this.$message.error(err.message || '发生了未知错误');
              this.$refs.information.submitted();
            });
        }
        if (image && !info) {
          this.$message.success('修改成功');
        }
      },
      reset() {
        this.$refs.information.resetForm();
        this.$refs.image.reset();
      },
    },
    async asyncData({ route, store }) {
      return store.dispatch('getEvent', route.params.name);
    },
    head() {
      return {
        title: '管理事件 - ' + this.name,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .sorter {
    width: 100%;
    text-align: left;
  }

  .event-form {
    margin-top: 1rem;
  }
</style>
