<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="72px">
    <el-form-item label="新闻链接" prop="url">
      <el-input
        v-model="form.url"
        placeholder="http://tech.sina.com.cn/i/2017-10-27/doc-ifynfvar4544789.shtml"
      />
    </el-form-item>

    <el-form-item label="标题" prop="title">
      <el-input
        v-model="form.title"
        placeholder="百度财报解读:摆脱魏则西影响 两项重要指标未达预期"
      />
    </el-form-item>

    <el-form-item label="来源媒体" prop="source">
      <el-input
        v-model="form.source"
        placeholder="新浪科技"
      />
    </el-form-item>

    <el-form-item label="摘要" prop="abstract">
      <el-input
        v-model="form.abstract"
        type="textarea"
        placeholder="百度最终在第二季度走出了监管阴影，这也成为自2016年第一季度以来百度首次真正实现同比增长…"
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

    <el-form-item label="状态" prop="status" v-if="mode === 'edit'">
      <el-select placeholder="请选择新闻状态" v-model="form.status">
        <el-option
          v-for="status in options"
          :key="status.value"
          :label="status.label"
          :value="status.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="所属进展" prop="stack">
      <stack-information-form
        v-if="!stack"
        v-model="form.stack"
        :event="+$route.params.name"
        @input="updateStack"
        ref="stack"
      />
      <span v-else>{{ stack.title }}</span>
    </el-form-item>

    <el-form-item label="备注" prop="comment">
      <comment-editor
        mode="editNews"
        :content="form.comment"
        ref="comment"
      />

      <span class="handbook" v-if="mode !== 'edit'">请依照 
        <a
          class="light-font"
          href="https://handbook.langchao.co/%E6%96%B0%E9%97%BB%E5%BD%95%E7%94%A8%E6%A0%87%E5%87%86.html"
          target="_blank"
        >社区指南</a> 提交新闻
      </span>
    </el-form-item>

    <div class="submit-button-group">
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
  import EventStackInformationForm from '~/components/EventStack/EventStackInformationForm.vue';
  import DatePicker from 'element-ui/lib/date-picker';
  import '~/static/element/date-picker.css';
  import '~/static/element/time-picker.css';
  import '~/static/element/time-select.css';

  export default {
    props: {
      data: String,
      mode: String, // 'create' or 'edit'
      stack: Object,
      news: Object,
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
          stack: null,
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
          stack: [
            { required: true, message: '请选择新闻所属进展', trigger: 'blur' },
          ],
          time: [
            { type: 'date', required: true, message: '请选择新闻发布时间', trigger: 'change' },
          ],
        },
        isSubmitting: false,
        commentTimeout: null,
        options: [
          { label: '过审', value: 'admitted' },
          { label: '拒绝', value: 'rejected' },
          { label: '移除', value: 'removed' },
          { label: '待审核', value: 'pending' },
        ],
      };
    },
    computed: {
      origData() {
        if (this.news) return this.news;
        return this.$store.getters.getNews({
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

            this.$store.commit('setTemp', {
              label: this.data,
              temp: {
                ...this.form,
                time: new Date(newTime),
                id: (this.origData || {}).id,
              },
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
      updateStack() {
        this.$set(this.form, 'stack', this.$refs.stack.value);
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
      'stack-information-form': EventStackInformationForm,
      'comment-editor': () => import(/* webpackChunkName:'editor' */ '~/components/Comment/Editor'),
    },
    created() {
      if (this.mode === 'edit' && this.origData) {
        this.form = Object.assign({}, this.origData);
        let newTime = new Date(this.origData.time).getTime();
        const minutesOffset = new Date().getTimezoneOffset() + 480;
        newTime += minutesOffset * 60000;
        this.$set(this.form, 'time', new Date(newTime));
      }
      if (this.stack && this.mode !== 'edit') {
        this.form.stack = this.stack.id;
      }
    },
    mounted() {
      this.setComment(this.form.comment);
    },
    watch: {
      'form.time'(newValue, oldValue) {
        if (this.form.time && this.form.time.getTime) {
          this.form.time.setSeconds(0);
          const offset = (new Date().getTimezoneOffset() + 480) * 60000 * 2;
          if (this.form.time.getTime() > Date.now() + offset) {
            this.$set(this.form, 'time', oldValue);
            this.$message.error('新闻发布时间如何才能比现在还晚？');
          }
        }
      },
      'news'(newValue, oldValue) {
        this.resetForm();
        this.resetButton();
      },
    },
  };
</script>
