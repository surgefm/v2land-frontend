<template>
  <background>
    <card>
      <p class="tag light-font">个人中心</p>
      <event-title>关注列表</event-title>
    </card>
    <subscription-card
      v-for="subscription of subscriptionList"
      :key="subscription.id"
      :subscription="subscription"
    />
    <logo class="logo" />
    <page-foot />
    <event-action />
  </background>
</template>

<script>
  import SubscriptionCard from '~/components/SubscriptionCard.vue'

  export default {
    computed: {
      isAdmin () {
        return this.$store.getters.isClientAdmin
      },
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      },
      subscriptionList () {
        return this.$store.getters.getSubscriptionList
      }
    },
    components: {
      'subscription-card': SubscriptionCard
    }
  }
</script>

<style lang="scss" scoped>
  .tag {
    font-size: .9rem;
    margin-right: .5rem;
  }
</style>
