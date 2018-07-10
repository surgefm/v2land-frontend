<template>
  <div :class="['stack-container', stack.status]">
    <span class="title">{{ stack.title }}</span>
    <el-tag
      :type="status[stack.status].type"
      size="mini"
    >
      {{ status[stack.status].label }}
    </el-tag>
    <i class="el-icon-more edit-icon" @click="$emit('click')" />
  </div>
</template>

<script>
export default {
  props: {
    'stack': Object,
  },
  data() {
    return {
      status: {
        pending: { type: 'warning', label: '待审核' },
        rejected: { type: 'danger', label: '拒绝' },
        admitted: { type: 'primary', label: '过审' },
        hidden: { type: 'info', label: '隐藏' },
        invalid: { type: 'danger', label: '数据异常' },
        removed: { type: 'info', label: '移除' },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
  @import '../../assets/variables.scss';

  .stack-container {
    border: $light-color 1.5px solid;
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

  .edit-icon {
    cursor: pointer;
    transform: rotate(270deg);
    font-size: 12px;
    color: $light-color;
  }

  .stack-container.pending {
    border-color: rgb(245, 215, 110);
  }

  .pending .edit-icon {
    color: rgb(245, 215, 110);
  }

  .stack-container.rejected, .stack-container.danger {
    border-color: rgb(236, 100, 75);
  }

  .rejected .edit-icon, .danger .edit-icon {
    color: rgb(236, 100, 75);
  }

  .stack-container.hidden, .stack-container.removed {
    border-color: rgb(189, 195, 199);
  }

  .hidden .edit-icon, .removed .edit-icon {
    color: rgb(189, 195, 199);
  }
</style>
