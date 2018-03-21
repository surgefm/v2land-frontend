<template>
  <div>
    <div style="display: none">
      <comment-item
        v-for="item of itemList"
        :key="item.type + '-' + item.key"
        :content="item.attrs ? item.attrs.content : 0"
        :ref="item.type + '-' + item.key"
        type="event"
      />
    </div>
    <div ref="editor" class="editor" />
    <el-button @click="triggerEvent">引用事件</el-button>
  </div>
</template>

<script>
import schema from './Schema';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { keymap } from 'prosemirror-keymap';
import { EventView } from './View';
import CommentItem from './CommentItem';

import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-gapcursor/style/gapcursor.css';

let view;
let _this;

export default {
  data() {
    return {
      view: null,
      items: {
        event: [{ key: 0 }],
        news: [{ key: 1 }],
        link: [{ key: 2 }],
      },
      count: 3,
      uid: [],
      components: {},
    };
  },
  computed: {
    itemList() {
      const list = [];
      for (const type of Object.getOwnPropertyNames(this.items)) {
        if (!this.items[type][0]) break;
        for (const item of this.items[type]) {
          list.push({
            ...item,
            type,
          });
        }
      }
      return list;
    },
  },
  mounted() {
    const state = EditorState.create({
      schema,
      plugins: [
        history(),
        dropCursor(),
        gapCursor(),
        keymap({ 'Mod-z': undo, 'Mod-y': redo }),
      ],
    });

    _this = this;

    view = new EditorView(this.$refs.editor, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
      },
      nodeViews: {
        event(node) {
          return new EventView(node, _this);
        },
      },
    });
  },
  methods: {
    async addItem(type, content, uid) {
      if (!type || !content) return;
      const items = this.items[type];
      const key = this.uid[uid] < 0 ? (items.length - 1) : this.uid[uid];
      const item = items[key];
      this.$set(
        this.items[type],
        key,
        {
          ...item,
          content,
          type,
        },
      );

      while (!this.$refs[type + '-' + item.key]) {
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
      }

      const comp = this.$refs[type + '-' + item.key][0].$children[0];
      comp.fetchData(content);
      if (this.uid[uid] < 0) {
        this.items[type].push({ key: items.length });
        this.uid[uid] = item.key;
      }

      this.components[uid] = comp;

      return comp;
    },
    getComponent(uid) {
      return this.components[uid];
    },
    async triggerEvent() {
      const id = Math.round(Math.random() * 10);
      const uid = this.uid.length;
      this.uid[uid] = -1;
      await this.addItem('event', id, uid);
      view.dispatch(view.state.tr.replaceWith(1, 1, schema.nodes.event.create({
        content: id,
        uid,
      })));
    },
  },
  components: {
    'comment-item': CommentItem,
  },
};
</script>
