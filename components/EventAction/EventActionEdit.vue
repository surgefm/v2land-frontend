<template>
  <nuxt-link
    :class="[
      'subscribe-container',
      $route.name !== 'event-edit' || 'exact-active-link'
    ]"
    :to="{ name: 'event-edit', params: { name: $route.params.name } }"
  >
    <span class="text light-font">管理事件</span>
    <i class="icon el-icon-edit-outline light-font" />
  </nuxt-link>
</template>
