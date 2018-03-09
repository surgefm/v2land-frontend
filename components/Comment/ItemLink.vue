<template>
  <el-tooltip
    class="link"
    :content="url"
  >
    <a :href="content" target="_blank">外部链接<i class="el-icon-caret-right" /></a>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    content: String,
  },
  computed: {
    url() {
      let url = this.content;
      if (url.length > 50) {
        url = url.slice(0, 50) + '...';
      }
      return url;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../../assets/variables.scss';

  .link {
    color: $light-color;
    font-size: .8rem;
    background-color: $light-background;
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
    background-color: $warning-background;
    color: $warning-color;
    border-bottom-color: $warning-color;
  }
</style>

