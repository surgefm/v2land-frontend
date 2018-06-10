<template>
  <div :class="['stack-container', stack.status]">
    <span class="title">{{ stack.title }}</span>
    <el-tag
      type="warning"
      v-if="stack.status === 'pending'"
      size="mini"
    >
      待审核
    </el-tag>
  </div>
</template>

<script>
export default {
  props: {
    'stack': Object,
  },
  computed: {
    type() {
      switch (this.stack) {
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      }

      return 'default';
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../../assets/variables.scss';

  .stack-container {
    border: #333 1.5px solid;
    border-radius: .25rem;
    margin: .25rem;
    padding: .25rem .5rem;
    cursor: grab;
    background-color: #fff;
    display: flex;
    align-items: center;
  }

  .stack-container > *:not(:last-child) {
    margin-right: .25rem;
  }

  .title {
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
  }

  .stack-container.pending {
    border-color: rgb(245, 215, 110);
  }
</style>
