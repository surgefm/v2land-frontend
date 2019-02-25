<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="4.5rem"
  >
    <el-form-item
      label="关注模式"
      prop="mode"
    >
      <el-select
        v-model="form.mode"
        placeholder="请选择在什么情况下提醒你"
        class="mode-selector"
        @change="submit"
      >
        <el-option
          v-for="mode in simpleMode"
          :key="mode.value"
          :label="mode.label"
          :value="mode.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        mode: 'EveryNewStack',
      },
      rules: {
        mode: [
          { required: true, message: '请选择关注模式', trigger: 'blur' },
        ],
      },
      simpleMode: [
        {
          label: '每当有新的进展时提醒我',
          value: 'EveryNewStack',
        }, {
          label: '每周五提醒我',
          value: 'EveryFriday',
        }, {
          label: '在事件有 30 天没有新消息时提醒我',
          value: '30DaysSinceLatestStack',
        },
      ],
    };
  },
  created() {
    this.form.mode = this.$store.state.subscribe.mode || this.form.mode;
    this.submit();
  },
  methods: {
    submit() {
      this.$store.commit('setSubscribeMode', this.form.mode);
      this.$emit('modeSelected');
    },
  },
};
</script>

<style lang="scss" scoped>
  .mode-container {
    display: flex;
    align-items: center;
  }

  .mode-container span {
    width: 5rem;
    margin-right: 1rem;
    text-align: right;
  }

  .mode-selector {
    width: 100%;
  }

  .submit-button-group {
    margin-top: 1rem;
  }
</style>
