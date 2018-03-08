<template>
  <nuxt-link
    class="subscribe-container"
    :to="'/' + this.$route.params.name + '/edit'"
  >
    <span class="text light-font">管理事件</span>
    <i class="icon el-icon-edit-outline light-font" />
  </nuxt-link>
</template>
