<template>
  <div>
    <span>
      你已成功关注事件 
      <span class="text-underline">{{ $route.params.name }}</span>
      。
    </span>
    <div class="submit-button-group">
      <nuxt-link :to="'/' + $route.params.name">
        <el-button type="primary">返回事件</el-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        mode: '',
        method: '',
        contact: ''
      }
    },
    created () {
      this.mode = this.$store.state.subscribe.mode
      this.method = this.$store.state.subscribe.method
      this.contact = this.$store.state.subscribe.contact
    }
  }
</script>

<style lang="scss" scoped>
  .submit-button-group {
    margin-top: 1rem;
  }
</style>
