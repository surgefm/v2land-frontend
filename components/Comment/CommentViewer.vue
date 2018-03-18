<template>
  <div class="editor">
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
import regs from '~/utils/regex';

export default {
  props: {
    input: String,
    mode: String,
  },
  data() {
    return {
      parts: [],
      timeout: null,
    };
  },
  methods: {
    analyzeInput() {
      if (!this.input) return [];

      let temp = this.input.slice();
      const parts = [];
      let start = 0;

      while (start < temp.length) {
        let matched = false;
        let lastIndex = -1;
        let type;
        let text;

        for (const reg of Object.getOwnPropertyNames(regs.editor)) {
          const match = regs.editor[reg].exec(temp);

          if (match && (lastIndex < 0 || regs.editor[reg].lastIndex < lastIndex)) {
            matched = true;
            type = reg;
            text = match[0];
            lastIndex = regs.editor[reg].lastIndex;
          }
        }

        if (matched) {
          parts.push({
            type: 'text',
            content: temp.slice(start, lastIndex - text.length),
          });

          if (['event', 'news'].includes(type)) {
            parts.push({
              type: type,
              content: parseInt(/([0-9]+)/g.exec(text)[0]),
            });
          } else if (type === 'link') {
            parts.push({
              type: 'link',
              content: /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g.exec(text)[0],
            });
          }

          temp = temp.slice(lastIndex);
        } else {
          parts.push({
            type: 'text',
            content: temp.slice(start),
          });
          start = temp.length;
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
  watch: {
    input() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.analyzeInput();
      }, 100);
    },
  },
};
</script>
