<template>
  <div class="switch-container">
    <span>自动排版</span>
    <el-switch
      v-model="newValue"
      @change="update"
    />
  </div>
</template>

<script>
export default {
  name: 'AutoformattingSwitch',
  props: ['value'],
  data() {
    return {
      newValue: true,
    };
  },
  created() {
    this.newValue = this.value;
  },
  methods: {
    update() {
      this.$emit('input', this.newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
  .switch-container {
    display: flex;
    align-items: center;
  }

  .switch-container span {
    font-size: 14px;
    margin-right: 4px;
    color: #333;
  }
</style>
