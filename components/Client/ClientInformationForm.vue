<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      class="form view"
      :rules="rules"
    >
      <div class="sorter">基本信息</div>
      <el-form-item
        label="用户名"
        :class="!(isAdmin ||isSelf) || 'edit'"
        prop="username"
      >
        <el-input v-if="isAdmin || isSelf" v-model="form.username" />
        <span v-else>{{ form.username }}</span>
      </el-form-item>
      <el-form-item
        label="用户组"
        :class="!isAdmin || 'edit'"
        prop="role"
      >
        <el-select v-if="isAdmin && !isSelf" v-model="form.role" placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.name"
            :value="item.value"
            :disabled="item.value === 'admin'"
          >
          </el-option>
        </el-select>
        <span v-else>{{ role }}</span>
      </el-form-item>
      <el-form-item
        label="邮箱"
        :class="!isAdmin || 'edit'"
        prop="email"
      >
        <el-input v-if="isAdmin" v-model="form.email" />
        <span v-else>{{ form.email }}</span>
      </el-form-item>
      <div class="submit-button-group" v-if="isAdmin || isSelf">
        <el-button
          type="primary"
          :loading="submitting"
          @click="submitChange"
        >
          保存修改
        </el-button>
      </div>

      <div class="divider" />
      <div class="sorter">绑定账户</div>
      <span
        v-if="(!form.auths || form.auths.length === 0) && isAdmin && !isSelf"
      >
        该用户没有绑定信息
      </span>

      <el-form-item
        v-for="auth of form.auths"
        :key="auth.site + auth.profileId"
        :label="authInfo(auth).site"
      >
        <span>{{ authInfo(auth).username }}</span>
        <el-button
          type="text"
          class="disconnect"
          v-if="isSelf"
          @click="unauthorize(auth)"
        >
          解除绑定
        </el-button>
      </el-form-item>
      <el-form-item v-if="showConnectTwitter" label="Twitter">
        <el-button
          size="small"
          type="primary"
          class="connect"
          plain
          @click="connectTwitter"
        >
          绑定 Twitter
        </el-button>
      </el-form-item>
      <el-form-item v-if="showConnectWeibo" label="新浪微博">
        <el-button
          size="small"
          type="danger"
          class="connect"
          plain
          @click="connectWeibo"
        >
          绑定新浪微博
        </el-button>
      </el-form-item>
    </el-form>
    <div class="divider" />
    <div class="sorter">修改密码</div>
    <el-form
      ref="passForm"
      :model="passForm"
      label-width="80px"
      class="form view"
      :rules="passRules"
      status-icon
    >
      <el-form-item 
        class="edit" 
        label="新密码" 
        prop="newPass"
      >
        <el-input 
          type="password" 
          v-model="passForm.newPass" 
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item 
        class="edit" 
        label="确认密码" 
        prop="checkNewPass">
        <el-input 
          type="password" 
          v-model="passForm.checkNewPass" 
          auto-complete="off"
          />
      </el-form-item>
      <el-form-item class="edit">
        <div class="submit-button-group">
          <el-button
            type="primary"
            :loading="passSubmitting"
            @click="submitChangePass"
          >
            确认
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import config from '~/const';

  export default {
    data() {
      const roles = [
        { name: '社区督导员', value: 'admin' },
        { name: '社区管理员', value: 'manager' },
        { name: '社区协作者', value: 'contributor' },
      ];

      const checkRole = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户组不能为空'));
        } else {
          for (const role of roles) {
            if (role.value === value) {
              return callback();
            }
          }

          return callback(new Error('不存在该用户组'));
        }
      };

      const validateNewPass = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入新密码'));
        } else {
          return callback();
        }
      };

      const validateConfirmationPass = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入确认密码'));
        } else if (value !== this.passForm.newPass) {
          return callback(new Error('确认密码和新密码不一致'));
        } else {
          return callback();
        }
      };
      return {
        form: {
          username: '',
          role: '',
          email: '',
          authList: [],
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 16 个字符之间', trigger: 'blur,change' },
          ],
          role: [
            { validator: checkRole, trigger: 'blur' },
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' },
          ],
        },
        passForm: {
          newPass: '',
          checkNewPass: '',
        },
        passRules: {
          newPass: [
            { validator: validateNewPass, trigger: 'blur' },
          ],
          checkNewPass: [
            { validator: validateConfirmationPass, trigger: 'blur' },
          ],
        },
        roles,
        submitting: false,
        passSubmitting: false,
        orig: {},
      };
    },
    props: {
      input: { type: Object },
    },
    computed: {
      client() {
        return this.input || this.$store.getters.getClient;
      },
      isSelf() {
        return this.client.id === this.$store.getters.getClient.id;
      },
      isAdmin() {
        return this.$store.getters.isClientAdmin;
      },
      role() {
        switch (this.form.role) {
        case 'admin':
          return '社区督导员';
        case 'manager':
          return '社区管理员';
        case 'contributor':
          return '社区协作者';
        default:
          return this.form.role;
        }
      },
      showConnectTwitter() {
        if (!this.client.auths || !this.isSelf) {
          return 0;
        }
        return (this.client.auths.filter((a) => a.site === 'twitter').length < 1);
      },
      showConnectWeibo() {
        if (!this.client.auths || !this.isSelf) {
          return 0;
        }
        return (this.client.auths.filter((a) => a.site === 'weibo').length < 1);
      },
      redirect() {
        return config.baseUrl + 'login/auth?redirect=/setting';
      },
    },
    methods: {
      authInfo(auth) {
        if (auth.profile) {
          switch (auth.site) {
          case 'weibo':
            return {
              site: '新浪微博',
              username: '@' + auth.profile.screen_name,
            };
          case 'twitter':
            return {
              site: 'Twitter',
              username: '@' + auth.profile.screen_name,
            };
          }
        }

        return {};
      },
      async submitChange() {
        try {
          if (!this.isFormChanged()) {
            return this.$message.warning('你尚未做出任何改动');
          }
          await this.$refs.form.validate(async (valid) => {
            if (!valid) {
              return false;
            }

            this.submitting = true;
            let url = `/client/${this.client.id}`;
            let response = await this.$axios.put(url, this.form);

            if (this.form.role !== this.orig.role) {
              url = '/client/role';
              response = await this.$axios.put(url, {
                id: this.client.id,
                newRole: this.form.role,
              });
            }

            const client = await this.$store.dispatch('getClient', this.client.id);
            this.$message.success(response.data.message);
            this.orig = { ...client };
            this.submitting = false;
            this.$refs.form.resetFields();
            this.updateForm();
            this.$emit('clientUpdated');
          });
        } catch (err) {
          this.$message.error(err.message || '修改失败');
          this.submitting = false;
        }
      },
      updateForm() {
        for (const attr of ['username', 'role', 'email', 'auths']) {
          this.$set(this.form, attr, this.orig[attr]);
        }
      },
      async unauthorize(auth) {
        try {
          await this.$axios.delete(`auth/${auth.id}`);
          const client = await this.$store.dispatch('getClient', this.client.id);
          this.orig = { ...client };
          this.updateForm();
          this.$message.success('解绑成功');
        } catch (err) {
          this.$message.error(err.message || '解绑失败');
        }
      },
      connectTwitter() {
        window.location = config.api + 'auth/twitter?redirect=' + this.redirect;
      },
      connectWeibo() {
        window.location = config.api + 'auth/weibo?redirect=' + this.redirect;
      },
      isFormChanged() {
        for (const attr of ['username', 'role', 'email']) {
          if (this.form[attr] !== this.orig[attr]) {
            return true;
          }
        }
        return false;
      },
      async submitChangePass() {
        this.$refs.passForm.validate( async (valid) => {
          if (valid) {
            this.passSubmitting = true;
            const url = '/client/password';
            const response = await this.$axios.put(url, {
              id: this.client.id,
              password: this.passForm.newPass,
            });
            this.passSubmitting = false;
            if (response.status === 201) {
              this.$message.success('密码修改成功');
              this.$refs.passForm.resetFields();
            } else {
              this.$message.error(response.message);
            }
          }
        });
      },
    },
    created() {
      this.orig = this.client;
      this.updateForm();
      this.orig = { ...this.client };
    },
  };
</script>

<style lang="scss" scoped>
  .form {
    margin-top: 1rem;
  }

  .el-form-item:not(.edit) {
    margin-bottom: 0;
  }

  .disconnect {
    margin-left: .5rem;
  }

  .connect:hover i:before,
  .connect:active i:before {
    color: #fff !important;
  }
</style>
