<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="90px">
    <el-form-item label="新闻链接" prop="url">
      <el-input v-model="form.url" />
    </el-form-item>

    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" />
    </el-form-item>

    <el-form-item label="来源" prop="source">
      <el-input v-model="form.source" />
    </el-form-item>

    <el-form-item label="摘要" prop="abstract">
      <el-input v-model="form.abstract" type="textarea" autosize />
    </el-form-item>

    <el-form-item label="发布时间" prop="time">
      <el-date-picker
        v-model="form.time"
        type="datetime"
        placeholder="请使用北京时间"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="备注" prop="comment">
      <el-input
        v-model="form.comment"
        type="textarea"
        placeholder="选填，支持 Markdown 语法"
      />
      <markdown v-if="form.comment" :input="form.comment" />
    </el-form-item>
    <div class="submit-button-group">
      <el-button @click="resetForm('form')">重置</el-button>
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
  import DatePicker from 'element-ui/lib/date-picker'

  export default {
    props: {
      data: String,
      mode: String
    },
    data () {
      let url = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
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
            { required: true, message: '请输入新闻链接', trigger: 'blur' },
            { pattern: url, message: '请输入正确的链接', trigger: 'blur' }
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
        },
        isSubmitting: false
      }
    },
    computed: {
      origData () {
        return this.$store.getters.getNews({
          name: this.$route.params.name,
          id: this.$route.params.id
        })
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isSubmitting = true
            // 调整时间
            let newTime = this.form.time.getTime()
            let minutesOffset = this.form.time.getTimezoneOffset() + 480
            newTime += minutesOffset * 60000
            this.form.time = new Date(newTime)

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
          this.$set(this.form, 'time', new Date(this.origData.time))
        } else {
          this.$refs[formName].resetFields()
        }
      },
      resetButton () {
        this.isSubmitting = false
      }
    },
    components: {
      'el-date-picker': DatePicker
    },
    created () {
      if (this.mode === 'edit' && this.origData) {
        this.form = Object.assign({}, this.origData)
        this.$set(this.form, 'time', new Date(this.origData.time))
      }
    },
    watch: {
      'form.time' () {
        if (this.form.time && this.form.time.getTime) {
          this.form.time.setSeconds(0)
        }
      }
    }
  }
</script>
