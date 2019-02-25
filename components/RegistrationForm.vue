<template>
  <div class="form-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="form"
    >
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input
          v-model="form.username"
          placeholder="浪小花"
        />
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="form.email"
          placeholder="flower@langchao.org"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="form.password"
          type="password"
          placeholder="********"
        />
      </el-form-item>
      <el-form-item
        v-if="requireInvitationCode"
        label="邀请码"
        prop="code"
      >
        <el-input
          v-model="form.code"
          placeholder="输入正确邀请码创建账号"
          @keyup.enter.native="submit"
        />
      </el-form-item>

      <p class="light-font notice">
        注意：为改进用户的使用体验，本站会采集您的部分使用数据
      </p>

      <div class="finish-button-group">
        <el-button
          type="primary"
          :loading="isSubmitting"
          @click="submit"
        >
          创建
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import config from '~/const.js';

export default {
  props: {
    username: String,
    password: String,
    email: String,
  },
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
      },
      isSubmitting: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: this.validateName, trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur,change' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: this.validatePassword, trigger: 'blur' },
        ],
        ...(!this.requireInvitationCode ? {} : {
          code: [
            { required: true, message: '请输入邀请码', trigger: 'blur' },
            { validator: this.validateCode, trigger: 'blur' },
          ],
        }),
      },
    };
  },
  computed: {
    redirect() {
      const redirect = this.$route.query.redirect;
      if (redirect) {
        if (redirect[0] === '/') {
          return redirect.slice(1);
        } else {
          return redirect;
        }
      }
      return '';
    },
    requireInvitationCode() {
      return config.requireInvitationCode;
    },
  },
  created() {
    for (const i of ['username', 'password', 'email']) {
      this.$set(this.form, i, this[i] || this.form[i]);
    }
  },
  methods: {
    validateName(rule, value, callback) {
      if (value.length < 2 || value.length > 16) {
        return callback(new Error('用户名长度必须在 2-16 字符间'));
      }

      if (/\r?\n|\r| |@/.test(value)) {
        return callback(new Error('不得含空格或 @ 字符'));
      }

      let allDigit = true;
      for (const char of value) {
        if (!/\d/.test(char)) {
          allDigit = false;
          break;
        }
      }
      if (allDigit) {
        return callback(new Error('用户名不得全为数字'));
      }

      callback();
    },
    validatePassword(rule, value, callback) {
      if (value.length < 6) {
        return callback(new Error('密码长度必须大于 5 个字符'));
      }

      if (!value.match(/[A-z]/i)) {
        return callback(new Error('密码必须含有至少 1 个英文字符'));
      }

      if (!value.match(/[0-9]/)) {
        return callback(new Error('密码必须含有至少 1 个数字'));
      }

      callback();
    },
    async validateCode(rule, value, callback) {
      try {
        await this.$axios.get('/code?code=' + value);
        callback();
      } catch (err) {
        callback(new Error('邀请码错误'));
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isSubmitting = true;
          this.$axios.post('client/register', this.form)
            .then(async (res) => {
              this.$message.success('账号创建成功，请留意查收验证邮件');
              await this.$store.dispatch('getClient');
              this.$emit('registered');
              this.isSubmitting = false;
            })
            .catch((err) => {
              this.$message.error(err.response.data.message);
              this.isSubmitting = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .form-container {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form {
    width: 100%;
    max-width: 25rem;
  }

  .notice {
    font-size: .9rem;
    line-height: 1.75;
  }

  .third-party {
    display: flex;
    align-items: center;
    color: #b4bccc;
    line-height: 1;
    font-size: 14px;
    font-weight: 500;
  }

  .el-form-item.is-required:before {
    content: ""
  }

  .finish-button-group {
    text-align: right;
    margin-top: 1rem;
  }
</style>
