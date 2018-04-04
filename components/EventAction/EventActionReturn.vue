<template>
  <nuxt-link class="subscribe-container" :to="route">
    <span class="text light-font">返回事件</span>
    <i class="icon el-icon-back light-font" />
  </nuxt-link>
</template>

<script>
export default {
  computed: {
    route() {
      if (this.$route.params.pinyin) {
        return `/${this.$route.params.name}/${this.route.params.pinyin}}`;
      }
      return `/${this.$route.params.name}`;
    },
  },
};
</script>
