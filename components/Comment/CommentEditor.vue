<template>
  <div class="editor-container">
    <el-popover
      ref="event"
      placement="top"
      width="250"
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
          引用
        </el-button>
      </div>
    </el-popover>

    <el-popover
      ref="news"
      placement="top"
      width="250"
      trigger="click"
    >
      <div class="editor-quote-form">
        <el-input
          v-model="news"
          placeholder="新闻 ID"
          size="small"
        />
        <el-button size="small" @click="addNews">引用</el-button>
      </div>
    </el-popover>

    <el-popover
      ref="link"
      placement="top"
      width="250"
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
          插入
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
          引用事件
        </el-button>
        <el-button size="small" v-popover:news>引用新闻</el-button>
        <el-button
          size="small"
          v-popover:link
          @click="focusField('link')"
        >
          插入链接
        </el-button>
        <el-button
          size="small"
          v-if="mode === 'editNews'"
        >
          模板
        </el-button>
      </el-button-group>
      <div class="expand" />
      <el-button-group class="group-button">
        <el-button
          size="small"
          @click="showPreview = true"
          v-if="!showPreview"
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

      this.comment += `{{{ event: ${event.id} }}}`;
      this.updateInput();
      this.event = null;
      this.$refs.event.doClose();
      this.$refs.eventField.close();
      this.$refs.input.focus();
    },
    addNews() {
      this.comment += `{{{ news: ${this.news} }}}`;
      this.updateInput();
      this.news = null;
    },
    addLink() {
      setTimeout(() => {
        if (!regs.link.test(this.link)) {
          return this.$message.error('请输入正确格式的链接');
        }

        this.comment += `{{{ link: ${this.link} }}}`;
        this.updateInput();
        this.link = null;
        this.$refs.link.doClose();
        this.$refs.input.focus();
      }, 50);
    },
    focusField(name) {
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
    padding: 5px 15px;
    position: relative;
    bottom: 1px;
  }

  .left-border {
    border-left: 1px solid #d8dce5;
    border-top-left-radius: 3px;
  }
</style>
