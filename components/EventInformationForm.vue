<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="90px">
    <el-form-item label="事件名" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>

    <el-form-item label="简介" prop="description">
      <el-input v-model="form.description" type="textarea" autosize></el-input>
    </el-form-item>

    <el-form-item label="事件状态" v-if="isAdmin">
      <el-select v-model="form.status">
        <el-option
          v-for="item in status"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>

    <div class="submit-button-group">
      <el-button @click="resetForm('form')">重置</el-button>
      <el-button
        type="primary"
        @click="submitForm('form')"
        size="medium"
        :disabled="isSubmitting"
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
      name: String
    },
    data () {
      return {
        form: {
          name: '',
          description: '',
          status: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入事件名', trigger: 'blur' },
            { validator: this.validateName, trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入事件简介', trigger: 'blur' },
            { max: 200, message: '简介字数不得超过 200 字', trigger: 'blur' }
          ]
        },
        status: [
          { value: 'admitted', label: '公开' },
          { value: 'pending', label: '待审核' },
          { value: 'rejected', label: '拒绝' },
          { value: 'hidden', label: '隐藏' }
        ],
        isSubmitting: false
      }
    },
    computed: {
      origData () {
        return this.$store.state.event[this.name]
      },
      isAdmin () {
        return this.$store.getters.isClientAdmin
      }
    },
    methods: {
      validateName (rule, value, callback) {
        this.$store.dispatch('getEvent', value)
          .then((event) => {
            if (event) {
              callback(new Error('已有公开的同名事件，或同名事件已在审核队列中'))
            } else {
              callback()
            }
          })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isSubmitting = true
            this.$store.commit('setTemp', {
              label: this.data,
              temp: this.form
            })
            this.$emit('submit')
          }
        })
      },
      resetForm (formName = 'form') {
        if (this.mode === 'edit' && this.origData) {
          this.form = Object.assign({}, this.origData)
        } else {
          this.$refs[formName].resetFields()
        }
      },
      resetButton () {
        this.isSubmitting = false
      }
    },
    created () {
      if (this.mode === 'edit' && this.origData) {
        this.form = Object.assign({}, this.origData)
      }
      if (this.mode !== 'edit' && this.isAdmin) {
        this.form.status = 'admitted'
      }
    }
  }
</script>
