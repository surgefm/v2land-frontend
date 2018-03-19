<template>
  <div class="editor-container">
    <el-popover
      ref="event"
      placement="top"
      width="280"
      trigger="click"
    >
      <div class="editor-quote-form">
        <el-autocomplete
          v-model="event"
          placeholder="事件名或 ID"
          size="small"
          :fetch-suggestions="findEvent"
          :trigger-on-focus="false"
          @keyup.enter.native="addEvent"
          ref="eventField"
        />
        <el-button
          size="small"
          @click="addEvent"
          type="primary"
        >
          引用事件
        </el-button>
      </div>
    </el-popover>

    <el-popover
      ref="news"
      placement="top"
      width="280"
      trigger="click"
    >
      <div class="editor-quote-form">
        <el-autocomplete
          v-model="news"
          placeholder="新闻标题或 ID"
          size="small"
          :fetch-suggestions="findNews"
          :trigger-on-focus="false"
          @keyup.enter.native="addNews"
          ref="newsField"
        />
        <el-button
          size="small"
          @click="addNews"
          type="primary"
        >
          引用新闻
        </el-button>
      </div>
    </el-popover>

    <el-popover
      ref="link"
      placement="top"
      width="280"
      trigger="click"
    >
      <div class="editor-quote-form">
        <el-input
          v-model="link"
          placeholder="站外链接"
          size="small"
          @keyup.enter.native="addLink"
          ref="linkField"
        />
        <el-button
          size="small"
          @click="addLink"
          type="primary"
        >
          插入链接
        </el-button>
      </div>
    </el-popover>

    <div
      class="button-container"
      :class="[!showPreview || 'left-border']"
    >
      <el-button-group class="group-button" v-show="!showPreview">
        <el-button
          size="small"
          v-popover:event
          @click="focusField('event')"
        >
          事件
        </el-button>
        <el-button
          size="small"
          v-popover:news
          @click="focusField('news')"
        >
          新闻
        </el-button>
        <el-button
          size="small"
          v-popover:link
          @click="focusField('link')"
        >
          链接
        </el-button>
        <el-dropdown
          v-if="mode === 'editNews'"
          @command="insertText"
          trigger="click"
        >
          <span class="template-trigger">
            模板
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item of templates"
              :key="item.label"
              :command="item.template"
              class="small-item"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-button-group>
      <div class="expand" />
      <el-button-group class="group-button">
        <el-button
          size="small"
          @click="showPreview = true"
          v-if="!showPreview"
          :disabled="!this.comment"
          class="preview"
        >
          预览
        </el-button>
        <el-button
          size="small"
          @click="showPreview = false"
          v-else
        >
          编辑
        </el-button>
      </el-button-group>
    </div>
    <el-input
      type="textarea"
      :autosize="{ minRows: 3 }"
      :placeholder="placeholder"
      resize="none"
      v-model="comment"
      @input="updateInput"
      class="textarea"
      v-if="!showPreview"
      ref="input"
    />
    <comment-viewer
      :input="value"
      class="viewer"
      v-else
    />
  </div>
</template>

<script>
import CommentViewer from '~/components/Comment/CommentViewer.vue';
import Autocomplete from 'element-ui/lib/autocomplete';
import regs from '~/utils/regex';

export default {
  props: {
    placeholder: String,
    value: String,
    mode: String,
  },
  data() {
    return {
      showPreview: false,
      event: null,
      news: null,
      link: null,
      comment: null,
      cursorPosition: {},
      templates: [
        {
          label: '可疑信息',
          template: '该消息中的（部分）事实与【媒体名】的【在此引用新闻】有冲突，请谨慎对待',
        },
        {
          label: '广泛流传',
          template: '该消息受到广泛传播，但来自不可信来源，请谨慎对待',
        },
        {
          label: '被证实的消息',
          template: '该消息由不可信来源发表，后由【媒体名】的【在此引用新闻】佐证',
        },
      ],
    };
  },
  methods: {
    async findEvent(event, cb) {
      const query = { where: {} };
      if (event) {
        query.where.or = [
          { name: { contains: event } },
          { id: parseInt(event) > -1 ? parseInt(event) : -1 },
        ];
      }
      const events = await this.$store.dispatch('getEventList', query);
      const results = [];
      for (const item of events) {
        results.push({ value: item.name });
      }

      cb(results);
    },
    async addEvent() {
      const event = await this.$store.dispatch('getEvent', this.event);
      if (!event) {
        return this.$message.error('未找到该事件');
      }

      this.insertText(`{{{ event: ${event.id} }}}`);
      this.event = null;
      this.$refs.event.doClose();
      this.$refs.eventField.close();
    },
    async findNews(news, cb) {
      const query = { where: {} };
      if (news) {
        query.where.or = [
          { title: { contains: news } },
          { id: parseInt(news) > -1 ? parseInt(news) : -1 },
        ];
      }
      const newsList = await this.$store.dispatch('getNewsList', query);
      const results = [];
      for (const item of newsList) {
        results.push({ value: item.title });
      }

      cb(results);
    },
    async addNews() {
      const news = await this.$store.dispatch('getNews', this.news);
      if (!news) {
        return this.$message.error('未找到该新闻');
      }

      this.insertText(`{{{ news: ${news.id} }}}`);
      this.news = null;
      this.$refs.news.doClose();
      this.$refs.newsField.close();
    },
    addLink() {
      const reg = new RegExp(regs.link);
      if (!reg.test(this.link)) {
        return this.$message.error('请输入符合正确格式的链接');
      }

      this.insertText(`{{{ link: ${this.link} }}}`);
      this.link = null;
      this.$refs.link.doClose();
    },
    insertText(text) {
      this.$refs.input.focus();
      if (this.cursorPosition.start) {
        const { start, end } = this.cursorPosition;
        this.comment = this.comment.slice(0, start) +
          text + this.comment.slice(end);
        const el = this.$refs.input.$el.firstChild;
        const position = start + text.length;
        setTimeout(() => {
          el.setSelectionRange(position, position);
          this.recordCursorPosition();
        }, 50);
      } else {
        this.comment += text;
        this.updateInput();
      }
    },
    recordCursorPosition() {
      const el = this.$refs.input.$el.firstChild;
      this.cursorPosition = {
        start: el.selectionStart,
        end: el.selectionEnd,
      };
    },
    focusField(name) {
      this.recordCursorPosition();
      setTimeout(this.$refs[name + 'Field'].focus, 0);
    },
    updateInput(value) {
      this.$emit('input', value || this.comment);
    },
  },
  created() {
    this.comment = this.value ? this.value.slice() : '';
  },
  components: {
    'comment-viewer': CommentViewer,
    'el-autocomplete': Autocomplete,
  },
};
</script>

<style lang="scss" scoped>
  .button-container {
    display: flex;
  }

  .expand {
    display: flex;
    flex-grow: 1;
    border-top: 1px solid #d8dce5;
    border-bottom: 1px solid #d8dce5;
  }

  .viewer {
    border: 1px solid #d8dce5;
    border-radius: 3px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
    padding: 5px 15px;
    position: relative;
    bottom: 2px;
  }

  .template-trigger {
    font-size: 12px;
    color: #5a5e66;
    white-space: nowrap;
    cursor: pointer;
    font-weight: 500;
    line-height: 1;
    padding: 9px;
  }

  .template-trigger:hover {
    color: #22a7f0 !important;
    background-color: rgb(233, 246, 254);
  }

  .left-border {
    border-left: 1px solid #d8dce5;
    border-top-left-radius: 3px;
  }

  .preview {
    transition: all .2s;
    border-color: #d8dce5;
  }
</style>
