<template>
  <el-form
    ref="form"
    :model="data"
    label-width="80px"
    :rules="rules"
  >
    <el-form-item label="标题" prop="title">
      <el-input
        :placeholder="latestStack.title"
        class="input name"
        v-model="data.title"
      />
    </el-form-item>
    <el-form-item label="简介" prop="description">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        :placeholder="latestStack.description"
        v-model="data.description"
      />
    </el-form-item>
    <el-form-item>
      <el-select placeholder="请选择进展状态" prop="status">
        <el-option
          v-for="status in options"
          :key="status.value"
          :label="status.label"
          :value="status.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    'stack': Object,
  },
  data() {
    return {
      data: {
        title: null,
        description: null,
        status: null,
      },
      rules: {
        title: [
          { required: true, message: '请输入进展标题', trigger: 'blur' },
        ],
        abstract: [
          { required: true, message: '请输入进展概要', trigger: 'blur' },
        ],
      },
      options: [
        { label: '过审', value: 'admitted' },
        { label: '拒绝', value: 'rejected' },
        { label: '隐藏', value: 'hidden' },
        { label: '移除', value: 'removed' },
        { label: '数据异常', value: 'invalid' },
        { label: '待审核', value: 'pending' },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
