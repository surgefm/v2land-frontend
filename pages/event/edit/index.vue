<template>
  <background>
    <card>
      <p class="tag light-font">
        {{ name }}
      </p>
      <event-title>管理事件</event-title>
      <div class="sorter">
        修改基本信息
      </div>
      <event-information-form
        ref="information"
        mode="edit"
        :data="'EditEvent-' + event.id"
        :name="name"
        :hide-buttons="true"
        class="event-form"
      />
      <div class="divider" />
      <div class="sorter">
        修改事件题图
      </div>
      <event-image-form
        ref="image"
        :name="name"
        :hide-buttons="true"
      />
      <div class="submit-button-group">
        <el-button
          type="text"
          @click="reset"
        >
          重置表单
        </el-button>
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
  async asyncData({ route, store }) {
    return store.dispatch('fetchEvent', route.params);
  },
  methods: {
    async submit() {
      const info = await this.$refs.information.submitForm();
      const image = await this.$refs.image.submit();
      if (info) {
        try {
          const { name } = this.$route.params;
          const data = this.$store.state.temp['EditEvent-' + name];
          await this.$store.dispatch('editEvent', { name, data });
          await this.$store.dispatch('fetchEvent', { name });
          this.$message.success('修改成功');
          this.$refs.information.submitted();
        } catch (err) {
          console.error(err);
          this.$message.error(err.message || '发生了未知错误');
          this.$refs.information.submitted();
        }
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
