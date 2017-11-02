<template>
  <nuxt-link
    class="subscribe-container"
    :to="'/' + this.$route.params.name + '/subscribe'"
  >
    <span class="text light-font">关注事件</span>
    <i class="icon el-icon-bell light-font"></i>
  </nuxt-link>
</template>
