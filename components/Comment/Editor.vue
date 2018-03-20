<template>
  <div ref="editor" />
</template>

<script>
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import bar from './Bar/EditorBar';

export default {
  mounted() {
    const state = EditorState.create({
      schema,
      plugins: [
        history(),
        keymap({ 'Mod-z': undo, 'Mod-y': redo }),
        bar(),
      ],
    });
    const view = new EditorView(this.$refs.editor, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
      },
    });
    console.log(view);
  },
};
</script>
