<template>
  <nuxt-link
    class="subscribe-container"
    :to="'/' + this.$route.params.name + '/edit/image'"
  >
    <span class="text light-font">修改题图</span>
    <i class="icon el-icon-picture-outline light-font" />
  </nuxt-link>
</template>
