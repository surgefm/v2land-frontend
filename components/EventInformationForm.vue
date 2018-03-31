<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="80px">
    <el-form-item label="事件名" prop="name">
      <el-input
        v-model="form.name"
        placeholder="百度魏则西事件"
      />
    </el-form-item>

    <el-form-item label="简介" prop="description">
      <el-input
        v-model="form.description"
        placeholder="2016 年 4 月 12 日，21 岁的魏则西因滑膜肉瘤去世，在其生前求医过程中，通过百度搜索到武警北京总队第二医院..."
        type="textarea"
        :autosize="{ minRows: 3 }"
      />
      <span class="handbook" v-if="!isAdmin">请依照 
        <a
          class="light-font"
          href="https://handbook.langchao.co/%E4%BB%80%E4%B9%88%E6%98%AF%E4%BA%8B%E4%BB%B6.html"
          target="_blank"
        >社区手册</a> 提交事件
      </span>
    </el-form-item>

    <el-form-item label="事件状态" v-if="isAdmin">
      <el-select v-model="form.status">
        <el-option
          v-for="item in status"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <div class="submit-button-group" v-if="!hideButtons">
      <el-button
        @click="resetForm('form')"
        type="text"
      >
        重置表单
      </el-button>
      <el-button
        type="primary"
        @click="submitForm('form')"
        size="medium"
        :loading="isSubmitting"
      >
        提交
      </el-button>
    </div>
  </el-form>
</template>

<script>
  export default {
    props: {
      data: String,
      mode: String,
      name: String,
      hideButtons: Boolean,
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
        return this.$store.state.event[this.name];
      },
      isAdmin() {
        return this.$store.getters.isClientAdmin;
      },
    },
    methods: {
      validateName(rule, value, callback) {
        if (this.$route.params.name === value) return callback();
        if (/\r?\n|\r| /.test(value)) {
          return callback(new Error('事件名不得含回车或空格'));
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

        this.$store.dispatch('getEvent', value)
          .then((event) => {
            if (event) {
              callback(new Error('已有公开的同名事件，或同名事件已在审核队列中'));
            } else {
              callback();
            }
          });
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
    },
    created() {
      if (this.mode === 'edit' && this.origData) {
        this.form = Object.assign({}, this.origData);
      }
      if (this.mode !== 'edit' && this.isAdmin) {
        this.form.status = 'admitted';
      }
    },
  };
</script>
