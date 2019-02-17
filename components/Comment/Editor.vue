<template>
  <div>
    <el-popover
      ref="event"
      placement="bottom"
      width="280"
      trigger="click"
    >
      <div class="editor-quote-form">
        <el-autocomplete
          ref="eventField"
          v-model="event"
          placeholder="事件名或 ID"
          size="small"
          :fetch-suggestions="findEvent"
          :trigger-on-focus="false"
          @keyup.enter.native="addEvent"
        />
        <el-button
          size="small"
          type="primary"
          @click="addEvent"
        >
          引用事件
        </el-button>
      </div>
    </el-popover>

    <el-popover
      ref="news"
      placement="bottom"
      width="280"
      trigger="click"
    >
      <div class="editor-quote-form">
        <el-autocomplete
          ref="newsField"
          v-model="news"
          placeholder="新闻标题或 ID"
          size="small"
          :fetch-suggestions="findNews"
          :trigger-on-focus="false"
          @keyup.enter.native="addNews"
        />
        <el-button
          size="small"
          type="primary"
          @click="addNews"
        >
          引用新闻
        </el-button>
      </div>
    </el-popover>

    <el-popover
      ref="link"
      placement="bottom"
      width="280"
      trigger="click"
    >
      <div class="editor-quote-form">
        <el-input
          ref="linkField"
          v-model="link"
          placeholder="站外链接"
          size="small"
          @keyup.enter.native="addLink"
        />
        <el-button
          size="small"
          type="primary"
          @click="addLink"
        >
          插入链接
        </el-button>
      </div>
    </el-popover>

    <div
      ref="editor"
      spellcheck="false"
      class="editor"
    />

    <div class="editor-control">
      <span
        v-popover:event
        class="control-button"
        @click="focusField('event')"
      >
        <i class="icon-flag" /><span>事件</span></span>
      <span
        v-popover:news
        class="control-button"
        @click="focusField('news')"
      >
        <i class="icon-newspaper" /><span>新闻</span></span>
      <span
        v-popover:link
        class="control-button"
        @click="focusField('link')"
      >
        <i class="icon-link" /><span>链接</span></span>
      <el-dropdown
        v-if="mode === 'editNews'"
        trigger="click"
        @command="insertText"
      >
        <span class="control-button">
          <i class="icon-template" /><span>模板</span></span>
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
    </div>
  </div>
</template>

<script>
import schema from './Schema';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView, DecorationSet, Decoration } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { ItemView } from '~/components/Comment/View';
import Autocomplete from 'element-ui/lib/autocomplete';

import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-gapcursor/style/gapcursor.css';
import '~/assets/Comment.scss';
import '~/static/element/autocomplete.css';

import regs from '~/utils/regex';

let view;
let _this;

export default {
  components: {
    'el-autocomplete': Autocomplete,
  },
  data() {
    return {
      event: null,
      news: null,
      link: null,
      mode: 'editNews',
      templates: [{
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
      }],
    };
  },
  mounted() {
    _this = this;

    const placeholder = (text) => {
      return new Plugin({
        props: {
          decorations(state) {
            const decorations = [];

            const decorate = (node, pos) => {
              if (node.type.isBlock && node.childCount === 0) {
                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    class: _this.mode === 'editNews'
                      ? 'empty-editor'
                      : 'empty-comment',
                  })
                );
              }
            };

            state.doc.descendants(decorate);

            return DecorationSet.create(state.doc, decorations);
          },
        },
      });
    };

    const initialState = {
      schema,
      plugins: [
        history(),
        dropCursor(),
        gapCursor(),
        placeholder(),
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-s-z': redo,
        }),
        keymap(baseKeymap),
      ],
    };

    const state = EditorState.create(initialState);

    view = new EditorView(this.$refs.editor, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
        let firstNode = view.state.doc.content;
        while ((!firstNode.type || firstNode.type.name === 'paragraph') &&
          firstNode.content && (firstNode.content[0] || firstNode.content.size > 0)) {
          firstNode = firstNode.content[0] || firstNode.content.content[0];
        }
        if (firstNode.type.name === 'hard_break') {
          view.dispatch(view.state.tr.delete(1, 2));
        }
      },
      nodeViews: {
        item(node) {
          return new ItemView(node, _this);
        },
      },
    });
  },
  methods: {
    getCursorPos() {
      const range = view.state.selection.ranges[0];
      const from = range.$from.pos;
      const to = range.$to.pos;
      return { from, to };
    },
    addItem(type, content) {
      const { from, to } = this.getCursorPos();
      view.dispatch(view.state.tr.replaceWith(
        from,
        to,
        schema.nodes.item.create({ content, type })
      ));
      view.focus();
    },
    insertText(text) {
      const { from, to } = this.getCursorPos();
      view.dispatch(view.state.tr.replaceWith(
        from,
        to,
        schema.text(text),
      ));
      view.focus();
    },
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

      this.addItem('event', event.id);
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

      this.addItem('news', news.id);
      this.news = null;
      this.$refs.news.doClose();
      this.$refs.newsField.close();
    },
    addLink() {
      const reg = new RegExp(regs.link);
      if (!reg.test(this.link)) {
        return this.$message.error('请输入符合正确格式的链接');
      }

      this.addItem('link', this.link);
      this.link = null;
      this.$refs.link.doClose();
    },
    focusField(name) {
      setTimeout(this.$refs[name + 'Field'].focus, 0);
    },
    setDoc(content) {
      if (!content) return this.clearDoc();

      let doc;
      try {
        doc = typeof content === 'string'
          ? JSON.parse(content)
          : content;
      } catch (err) {
        return null;
      }

      while (doc.doc) {
        doc = doc.doc;
      }

      const newState = EditorState.create({
        schema,
        doc: schema.nodeFromJSON(doc),
        plugins: view.state.plugins,
      });

      view.updateState(newState);
    },
    clearDoc() {
      const newState = EditorState.create({
        schema,
        plugins: view.state.plugins,
      });

      view.updateState(newState);
    },
    toJSON() {
      return view.state.toJSON();
    },
  },
};
</script>
