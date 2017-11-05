<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="90px">
    <el-form-item label="事件名" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>

    <el-form-item label="简介" prop="description">
      <el-input v-model="form.description" type="textarea" autosize></el-input>
    </el-form-item>

    <el-form-item label="是否可见">
      <el-switch v-model="form.visible"></el-switch>
    </el-form-item>

    <div class="submit-button-group">
      <el-button @click="resetForm('form')">重置</el-button>
      <el-button type="primary" @click="submitForm('form')" size="medium">提交</el-button>
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
      let url = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
      return {
        form: {
          name: '',
          description: '',
          visible: false
        },
        rules: {
          url: [
            { required: true, message: '请输入新闻链接', trigger: 'blur' },
            { pattern: url, message: '请输入正确的链接', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入事件名', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入事件简介', trigger: 'blur' },
            { max: 200, message: '简介字数不得超过 200 字', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      origData () {
        return this.$store.state.event[this.name]
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
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
      }
    },
    created () {
      if (this.mode === 'edit' && this.origData) {
        this.form = Object.assign({}, this.origData)
      }
    }
  }
</script>
