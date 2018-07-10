<template>
  <div class="editor">
    <div class="md" v-html="compiledMarkdown" />
  </div>
</template>
  
<script>
  import marked from 'marked';

  export default {
    props: {
      input: String,
    },
    computed: {
      compiledMarkdown() {
        return marked('*备注：*' + this.input, { sanitize: true });
      },
    },
  };
</script>
