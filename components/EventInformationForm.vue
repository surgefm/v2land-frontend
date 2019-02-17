<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="80px"
  >
    <el-form-item
      label="事件名"
      prop="name"
    >
      <el-input
        v-model="form.name"
        placeholder="百度魏则西事件"
        @focus="spacing('name')"
        @blur="spacing('name')"
      />
    </el-form-item>

    <el-form-item
      label="简介"
      prop="description"
    >
      <el-input
        v-model="form.description"
        placeholder="2016 年 4 月 12 日，21 岁的魏则西因滑膜肉瘤去世，在其生前求医过程中，通过百度搜索到武警北京总队第二医院..."
        type="textarea"
        :autosize="{ minRows: 3 }"
        @focus="spacing('description')"
        @blur="spacing('description')"
      />
    </el-form-item>

    <el-form-item
      v-if="isAdmin"
      label="事件状态"
    >
      <el-select v-model="form.status">
        <el-option
          v-for="item in status"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <div
      v-if="!hideButtons"
      class="submit-button-group"
    >
      <el-button
        type="text"
        @click="resetForm('form')"
      >
        重置表单
      </el-button>
      <el-button
        type="primary"
        size="medium"
        :loading="isSubmitting"
        @click="submitForm('form')"
      >
        提交
      </el-button>
    </div>
  </el-form>
</template>

<script>
import Pangu from 'pangu/src/shared/core';
const { spacing } = Pangu;

export default {
  props: {
    data: String,
    mode: String,
    name: String,
    hideButtons: Boolean,
    autoFormatting: Boolean,
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        status: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入事件名', trigger: 'blur' },
          { validator: this.validateName, trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入事件简介', trigger: 'blur' },
          { max: 200, message: '简介字数不得超过 200 字', trigger: 'blur' },
        ],
      },
      status: [
        { value: 'admitted', label: '公开' },
        { value: 'pending', label: '待审核' },
        { value: 'rejected', label: '拒绝' },
        { value: 'hidden', label: '隐藏' },
      ],
      isSubmitting: false,
    };
  },
  computed: {
    origData() {
      return this.$store.getters.getEvent(this.name);
    },
    isAdmin() {
      return this.$store.getters.isClientAdmin;
    },
  },
  created() {
    if (this.mode === 'edit' && this.origData) {
      this.form = Object.assign({}, this.origData);
    }
    if (this.mode !== 'edit' && this.isAdmin) {
      this.form.status = 'admitted';
    }
  },
  methods: {
    validateName(rule, value, callback) {
      if (this.$route.params.name === value) return callback();
      if ((value || '').trim() != value) {
        return callback(new Error('事件名前后不得含回车或空格'));
      }

      let allDigit = true;
      for (const char of value) {
        if (!/\d/.test(char)) {
          allDigit = false;
          break;
        }
      }
      if (allDigit) {
        return callback(new Error('事件名不得全为数字'));
      }

      if (!this.origData || this.origData.name !== value) {
        this.$store.dispatch('getEvent', { name: value, silent: true })
          .then((event) => {
            if (event && (this.mode !== 'edit' || (this.origData.id !== event.id))) {
              callback(new Error('已有公开的同名事件，或同名事件已在审核队列中'));
            } else {
              callback();
            }
          });
      } else {
        callback();
      }
    },
    async submitForm(formName = 'form') {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isSubmitting = true;
            this.$store.commit('setTemp', {
              label: this.data,
              temp: this.form,
            });
            this.$emit('submit');
            return resolve(true);
          }
          resolve(false);
        });
      });
    },
    resetForm(formName = 'form') {
      if (this.mode === 'edit' && this.origData) {
        this.form = Object.assign({}, this.origData);
      } else {
        this.$refs[formName].resetFields();
      }
    },
    resetButton() {
      this.isSubmitting = false;
    },
    submitted() {
      this.isSubmitting = false;
    },
    spacing(attr) {
      if (this.autoFormatting) {
        this.form[attr] = spacing(this.form[attr]);
      }
    },
  },
};
</script>
