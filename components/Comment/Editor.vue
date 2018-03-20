<template>
  <div ref="editor" />
</template>

<script>
import schema from './Schema';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import bar from './Bar/EditorBar';
import { EventView } from './View';

let view;

export default {
  data() {
    return {
      view: null,
    };
  },
  mounted() {
    const state = EditorState.create({
      schema,
      plugins: [
        history(),
        keymap({ 'Mod-z': undo, 'Mod-y': redo }),
        bar(),
      ],
    });

    state.vue = this;

    view = new EditorView(this.$refs.editor, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
      },
      nodeViews: {
        event(node) {
          return new EventView(node, state);
        },
      },
    });
  },
};
</script>
