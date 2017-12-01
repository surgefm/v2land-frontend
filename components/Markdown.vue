<template>
  <div class="editor">
    <p class="light-font">备注：</p>
    <div class="md" v-html="compiledMarkdown" />
  </div>
</template>
  
<script>
  import marked from 'marked'

  export default {
    props: {
      input: String
    },
    computed: {
      compiledMarkdown () {
        return marked(this.input, { sanitize: true })
      }
    }
  }
</script>
