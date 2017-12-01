<template>
  <div class="editor">
    <div v-html="compiledMarkdown" />
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
