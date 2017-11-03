<template>
  <nuxt-link
    class="subscribe-container"
    :to="'/' + this.$route.params.name + '/admit'"
  >
    <span v-if="pendingNews" class="badge">{{ pendingNews }}</span>
    <span class="text light-font">审核队列</span>
    <i class="icon el-icon-tickets light-font"></i>
  </nuxt-link>
</template>

<script>
  export default {
    computed: {
      name () {
        return this.$route.params.name
      },
      pendingNews () {
        return this.$store.getters.getPendingNews(this.name).length
      }
    },
    created () {
      this.$store.dispatch('getPendingNews', this.$route.params.name)
    }
  }
</script>

<style scoped>
  .badge {
    position: absolute;
    right: .125rem;
    top: .125rem;
    font-size: .75rem;
    border-radius: 1rem;
    white-space: nowrap;
    padding: 0 .25rem;
    background-color: #fa5555;
    color: #fff;
    text-align: center;
    min-width: 1.25rem;
    height: 1.25rem;
    line-height: 1.65;
  }
</style>
