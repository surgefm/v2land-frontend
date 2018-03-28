<template>
  <a
    :href="href"
    target="_blank"
    class="link"
  ><i class="icon-link" /> {{ url }}</a>
</template>

<script>
export default {
  props: {
    content: String,
  },
  data() {
    return { href: null };
  },
  computed: {
    url() {
      let url = this.content;

      for (const pattern of ['https://www.', 'https://', 'http://www.', 'http://']) {
        if (url.slice(0, pattern.length) === pattern) {
          url = url.slice(pattern.length);
          break;
        }
      }

      if (url.length > 24) {
        url = url.slice(0, 24) + '...';
      }

      return url;
    },
  },
  created() {
    this.href = '/redirect.html?to=' + encodeURIComponent(this.content);
  },
};
</script>

<style lang="scss" scoped>
  @import '../../assets/variables.scss';

  .link {
    color: $warning-color;
    font-size: .8rem;
    background-color: $warning-background;
    border-radius: .125rem;
    border-bottom: .1125rem solid transparent;
    padding: .25rem;
    padding-bottom: .1125rem;
    transition: all .2s;
    cursor: pointer;
  }

  .link:hover {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: $warning-border;
  }

  .link {
    word-break: break-all;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
</style>

