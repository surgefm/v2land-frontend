<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="90px">
    <el-form-item label="新闻链接" prop="url">
      <el-input v-model="form.url"></el-input>
    </el-form-item>

    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>

    <el-form-item label="来源" prop="source">
      <el-input v-model="form.source"></el-input>
    </el-form-item>

    <el-form-item label="摘要" prop="abstract">
      <el-input v-model="form.abstract" type="textarea" autosize></el-input>
    </el-form-item>

    <el-form-item label="发布时间" prop="time">
      <el-date-picker
        v-model="form.time"
        type="datetime"
        placeholder="请使用北京时间"
      >
      </el-date-picker>
    </el-form-item>

    <div class="submit-button-group">
      <el-button @click="resetForm('form')">重置</el-button>
      <el-button type="primary" @click="submitForm('form')" size="medium">提交</el-button>
    </div>
  </el-form>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          url: '',
          title: '',
          source: '',
          abstract: '',
          time: ''
        },
        rules: {
          url: [
            { required: true, message: '请输入新闻链接', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入新闻标题', trigger: 'blur' }
          ],
          source: [
            { required: true, message: '请输入新闻来源', trigger: 'blur' }
          ],
          abstract: [
            { required: true, message: '请输入新闻摘要', trigger: 'blur' },
            { max: 150, message: '摘要字数不得超过 150 字', trigger: 'blur' }
          ],
          time: [
            { type: 'date', required: true, message: '请选择新闻发布时间', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message.success('提交成功，该新闻会在审核后列入该事件')
            this.resetForm('form')
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
