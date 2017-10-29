<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="90px">
      <el-form-item label="提醒方法" prop="method">
        <el-select
          v-model="form.method"
          placeholder="请选择通过什么方式提醒你"
          class="method-selector"
        >
          <el-option
            v-for="method in methodCollection"
            :key="method.value"
            :label="method.label"
            :value="method.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.method === 'email'" label="邮箱地址" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
    </el-form>


    <div class="submit-button-group-separate">
      <el-button type="primary" @click="lastStep">上一步</el-button>
      <div>
        <el-button v-if="form.method === 'twitter'">
          绑定 Twitter 账号
        </el-button>
        <el-button v-else type="primary" @click="submit" :disabled="!isSubmittable">
          下一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          method: 'email',
          email: ''
        },
        rules: {
          method: [
            { required: true, message: '请选择提醒方法', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ]
        },
        methodCollection: [
          {
            label: '邮件推送',
            value: 'email'
          }, {
            label: '通过我的 Twitter 账户发推',
            value: 'twitter'
          }
        ]
      }
    },
    computed: {
      isSubmittable () {
        return this.form.method && this.form[this.form.method]
      }
    },
    methods: {
      lastStep () {
        this.save()
        this.$emit('goToMode')
      },
      submit () {
        this.save()
        this.$emit('methodSelected')
      },
      save () {
        this.$store.commit('setSubscribeMethod', {
          method: this.form.method,
          contact: this.form[this.form.method]
        })
      }
    },
    created () {
      this.form.method = this.$store.state.subscribe.method || 'email'
      this.form[this.form.method] = this.$store.state.subscribe.contact
    }
  }
</script>

<style scoped>
  .method-container {
    display: flex;
    align-items: center;
    margin-bottom: .5rem;
  }

  .method-container span {
    width: 5rem;
    margin-right: 1rem;
    text-align: right;
  }

  .method-selector {
    width: calc(100% - 90px);
  }

  .submit-button-group-separate {
    margin-top: 1rem;
  }
</style>
