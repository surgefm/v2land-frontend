<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="72px"
  >
    <el-form-item
      label="新闻链接"
      prop="url"
    >
      <el-input
        v-model="form.url"
        placeholder="http://tech.sina.com.cn/i/2017-10-27/doc-ifynfvar4544789.shtml"
      />
    </el-form-item>

    <el-form-item
      label="标题"
      prop="title"
    >
      <el-input
        v-model="form.title"
        placeholder="百度财报解读:摆脱魏则西影响 两项重要指标未达预期"
      />
    </el-form-item>

    <el-form-item
      label="来源媒体"
      prop="source"
    >
      <el-input
        v-model="form.source"
        placeholder="新浪科技"
      />
    </el-form-item>

    <el-form-item
      label="摘要"
      prop="abstract"
    >
      <el-input
        v-model="form.abstract"
        type="textarea"
        placeholder="百度最终在第二季度走出了监管阴影，这也成为自2016年第一季度以来百度首次真正实现同比增长…"
        :autosize="{ minRows: 3 }"
      />
    </el-form-item>

    <el-form-item
      label="发布时间"
      prop="time"
    >
      <el-date-picker
        v-model="form.time"
        type="datetime"
        :editable="false"
        placeholder="请使用北京时间"
      />
    </el-form-item>

    <el-form-item
      v-if="mode === 'edit'"
      label="状态"
      prop="status"
    >
      <el-select
        v-model="form.status"
        placeholder="请选择新闻状态"
      >
        <el-option
          v-for="status in options"
          :key="status.value"
          :label="status.label"
          :value="status.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="所属进展"
      prop="stackId"
    >
      <stack-information-form
        v-if="mode === 'edit' || !stack"
        ref="stack"
        :stack="form.stackId"
        :event="+$route.params.name"
        @input="updateStack"
      />
      <span v-else>{{ stack.title }}</span>
    </el-form-item>

    <el-form-item
      label="备注"
      prop="comment"
    >
      <comment-editor
        ref="comment"
        mode="editNews"
        :content="form.comment"
      />

      <span
        v-if="mode !== 'edit'"
        class="handbook"
      >请依照
        <a
          class="light-font"
          href="https://handbook.langchao.co/%E6%96%B0%E9%97%BB%E5%BD%95%E7%94%A8%E6%A0%87%E5%87%86.html"
          target="_blank"
        >社区指南</a> 提交新闻
      </span>
    </el-form-item>

    <div class="submit-button-group">
      <el-button
        type="text"
        @click="resetForm('form')"
      >
        重置表单
      </el-button>
      <el-button
        type="primary"
        size="medium"
        :loading="isSubmitting"
        @click="submitForm('form')"
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

import getFormattedTime from '~/utils/getFormattedTime.js';
import getLocalTime from '~/utils/getLocalTime.js';
import isTimeValid from '~/utils/isTimeValid.js';

export default {
  components: {
    'el-date-picker': DatePicker,
    'stack-information-form': EventStackInformationForm,
    'comment-editor': () => import(/* webpackChunkName:'editor' */ '~/components/Comment/Editor'),
  },
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
        stackId: null,
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
        stackId: [
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
  watch: {
    'form.time'(newValue, oldValue) {
      if (this.form.time && this.form.time.getTime) {
        if (!isTimeValid(this.form.time)) {
          this.$set(this.form, 'time', oldValue);
          this.$message.error('新闻发布时间不能晚于此刻');
        } else {
          this.form.time.setSeconds(0);
        }
      }
    },
    'news'(newValue, oldValue) {
      this.resetForm();
      this.resetButton();
    },
  },
  created() {
    if (this.mode === 'edit' && this.origData) {
      this.form = Object.assign({}, this.origData);
      this.form.time = getLocalTime(this.origData.time);
      this.resetForm();
    }
    if (this.stack) {
      this.form.stackId = this.stack.id;
    }
  },
  mounted() {
    this.setComment(this.form.comment);
  },
  methods: {
    submitForm(formName) {
      this.form.comment = JSON.stringify(this.$refs.comment.toJSON().doc);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isSubmitting = true;
          // 调整时间
          const newTime = getFormattedTime(this.form.time);

          this.$store.commit('setTemp', {
            label: this.data,
            temp: {
              ...this.form,
              time: newTime,
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
        this.form.time = getLocalTime(this.origData.time);
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
      this.form.stackId = this.$refs.stack.value;
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
};
</script>
