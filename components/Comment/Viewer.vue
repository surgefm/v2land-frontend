<template>
  <div class="editor viewer" v-if="!error">
    <span v-if="mode === 'remark'" class="remark">备注：</span>
    <comment-item
      v-for="(part, i) of parts"
      :key="part.type + i + part.content"
      :type="part.type"
      :content="part.content"
    />
  </div>
</template>

<script>
import CommentItem from './CommentItem.vue';
import '~/assets/Comment.scss';

export default {
  props: ['mode', 'input'],
  data() {
    return {
      parts: [],
      error: false,
    };
  },
  methods: {
    analyzeInput() {
      const parts = [];
      let doc = this.input;
      if (!doc) return;
      if (typeof doc === 'string') {
        try {
          doc = JSON.parse(doc);
        } catch (err) {
          this.error = true;
          return;
        }
      }
      while (doc.doc) {
        doc = doc.doc;
      }
      let content = doc.content[0];
      if (!content.content) {
        this.error = true;
        return;
      }
      content = content.content;
      for (const item of content) {
        if (item.type === 'text') {
          parts.push({ type: 'text', content: item.text });
        } else if (item.type === 'item') {
          parts.push(item.attrs);
        }
      }
      this.parts = parts;
    },
  },
  components: {
    'comment-item': CommentItem,
  },
  created() {
    this.analyzeInput();
  },
};
</script>
