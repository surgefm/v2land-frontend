<template>
  <nuxt-link
    :class="[
      'subscribe-container',
      $route.name !== 'event-post' || 'exact-active-link'
    ]"
    :to="{
      name: 'event-post',
      params: { name: $route.params.name },
    }"
  >
    <span class="text light-font">添加新闻</span>
    <i class="icon el-icon-plus light-font" />
  </nuxt-link>
</template>
