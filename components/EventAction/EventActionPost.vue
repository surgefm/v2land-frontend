<template>
  <nuxt-link
    :class="[
      'subscribe-container',
      $route.name !== 'name-post' || 'exact-active-link'
    ]"
    :to="'/' + this.$route.params.name + '/post'"
  >
    <span class="text light-font">添加新闻</span>
    <i class="icon el-icon-plus light-font" />
  </nuxt-link>
</template>
