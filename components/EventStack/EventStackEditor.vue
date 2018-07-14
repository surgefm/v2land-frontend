<template>
  <el-form
    ref="form"
    :model="data"
    label-width="80px"
    :rules="rules"
  >
    <el-form-item label="标题" prop="title">
      <el-input
        :placeholder="origStack.title"
        class="input name"
        v-model="data.title"
      />
    </el-form-item>
    <el-form-item label="简介" prop="description">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        :placeholder="origStack.description"
        v-model="data.description"
      />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select placeholder="请选择进展状态" v-model="data.status">
        <el-option
          v-for="status in options"
          :key="status.value"
          :label="status.label"
          :value="status.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="发布时间" prop="time">
      <el-date-picker
        v-model="data.time"
        type="datetime"
        :editable="false"
        class="time-picker"
        placeholder="默认为首条新闻发布时间"
      />
      <el-button type="text" @click="clearTime">
        清空时间
      </el-button>
    </el-form-item>

    <div class="submit-button-group">
      <el-button
        @click="reset()"
        type="text"
      >
        重置表单
      </el-button>
      <el-button
        type="primary"
        @click="submit()"
        size="medium"
        :loading="isSubmitting"
      >
        提交
      </el-button>
    </div>
  </el-form>
</template>

<script>
import DatePicker from 'element-ui/lib/date-picker';
import '~/static/element/date-picker.css';
import '~/static/element/time-picker.css';
import '~/static/element/time-select.css';

import getFormattedTime from '~/utils/getFormattedTime.js';
import getLocalTime from '~/utils/getLocalTime.js';
import isTimeValid from '~/utils/isTimeValid.js';

export default {
  props: {
    'stack': Object,
  },
  data() {
    return {
      origStack: {},
      data: {
        title: null,
        description: null,
        status: null,
        time: null,
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
      isSubmitting: false,
    };
  },
  methods: {
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.isSubmitting = true;
          try {
            if (this.data.time) {
              this.data.time = getFormattedTime(this.data.time);
            }
            await this.$axios.put('stack/' + this.stack.id, this.data);
            this.$message.success('修改成功');
            this.$emit('edited');
          } catch (err) {
            console.error(err);
            this.$message.error(err.response.data.message || '发生了未知错误');
          } finally {
            this.isSubmitting = false;
          }
        }
      });
    },
    clearTime() {
      this.data.time = null;
    },
    reset() {
      this.data = { ...this.origStack };
      this.data.time = getLocalTime(this.origStack.time);
    },
  },
  created() {
    this.origStack = { ...this.stack };
    this.data = { ...this.stack };
    this.data.time = getLocalTime(this.stack.time);
  },
  watch: {
    'data.time'(newValue, oldValue) {
      if (this.data.time && this.data.time.getTime) {
        if (!isTimeValid(this.data.time)) {
          this.data.time = oldValue;
          this.$message.error('进展发生时间不能晚于此刻');
        } else {
          this.data.time.setSeconds(0);
        }
      }
    },
  },
  components: {
    'el-date-picker': DatePicker,
  },
};
</script>

<style lang="scss" scoped>
  .time-picker {
    margin-right: .5rem;
  }
</style>

