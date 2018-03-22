<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="72px">
    <el-form-item label="新闻链接" prop="url">
      <el-input v-model="form.url" />
    </el-form-item>

    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" />
    </el-form-item>

    <el-form-item label="来源媒体" prop="source">
      <el-input v-model="form.source" />
    </el-form-item>

    <el-form-item label="摘要" prop="abstract">
      <el-input
        v-model="form.abstract"
        type="textarea"
        :autosize="{ minRows: 3 }"
      />
    </el-form-item>

    <el-form-item label="发布时间" prop="time">
      <el-date-picker
        v-model="form.time"
        type="datetime"
        :editable="false"
        placeholder="请使用北京时间"
      />
    </el-form-item>

    <el-form-item label="备注" prop="comment">
      <comment-editor
        mode="editNews"
        :content="form.comment"
        ref="comment"
      />
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
  import DatePicker from 'element-ui/lib/date-picker';
  import '~/static/element/date-picker.css';
  import '~/static/element/time-picker.css';
  import '~/static/element/time-select.css';

  export default {
    props: {
      data: String,
      mode: String,
    },
    data() {
      const url = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
      return {
        form: {
          url: '',
          title: '',
          source: '',
          abstract: '',
          time: '',
          comment: null,
        },
        rules: {
          url: [
            { required: true, message: '请输入新闻链接', trigger: 'blur' },
            { pattern: url, message: '请输入正确的链接', trigger: 'blur' },
          ],
          title: [
            { required: true, message: '请输入新闻标题', trigger: 'blur' },
          ],
          source: [
            { required: true, message: '请输入新闻来源', trigger: 'blur' },
          ],
          abstract: [
            { required: true, message: '请输入新闻摘要', trigger: 'blur' },
            { max: 150, message: '摘要字数不得超过 150 字', trigger: 'blur' },
          ],
          time: [
            { type: 'date', required: true, message: '请选择新闻发布时间', trigger: 'change' },
          ],
        },
        isSubmitting: false,
        commentTimeout: null,
      };
    },
    computed: {
      origData() {
        return this.$store.getters.getNews({
          name: this.$route.params.name,
          id: this.$route.params.id,
        });
      },
    },
    methods: {
      submitForm(formName) {
        this.form.comment = JSON.stringify(this.$refs.comment.toJSON().doc);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isSubmitting = true;
            // 调整时间
            let newTime = this.form.time.getTime();
            const minutesOffset = this.form.time.getTimezoneOffset() + 480;
            newTime += minutesOffset * 60000;
            this.form.time = new Date(newTime);

            this.$store.commit('setTemp', {
              label: this.data,
              temp: this.form,
            });
            this.$emit('submit');
          }
        });
      },
      resetForm(formName = 'form') {
        if (this.mode === 'edit' && this.origData) {
          this.form = Object.assign({}, this.origData);
          this.$set(this.form, 'time', new Date(this.origData.time));
          this.setComment(this.origData.comment);
        } else {
          this.$refs[formName].resetFields();
          this.setComment();
        }
      },
      resetButton() {
        this.isSubmitting = false;
      },
      setComment(doc) {
        if (!this.$refs.comment) {
          if (this.commentTimeout) {
            clearTimeout(this.commentTimeout);
          }

          this.commentTimeout = setTimeout(() => {
            this.setComment(doc);
          }, 100);
        } else {
          this.$refs.comment.setDoc(doc);
        }
      },
    },
    components: {
      'el-date-picker': DatePicker,
      'comment-editor': () => import(/* webpackChunkName:'editor' */ '~/components/Comment/Editor'),
    },
    created() {
      if (this.mode === 'edit' && this.origData) {
        this.form = Object.assign({}, this.origData);
        this.$set(this.form, 'time', new Date(this.origData.time));
      }
    },
    mounted() {
      this.setComment(this.form.comment);
    },
    watch: {
      'form.time'(newValue, oldValue) {
        if (this.form.time && this.form.time.getTime) {
          this.form.time.setSeconds(0);
          if (this.form.time > Date.now()) {
            this.$set(this.form, 'time', oldValue);
            this.$message.error('新闻发布时间如何才能比现在还晚？');
          }
        }
      },
    },
  };
</script>
