<template>
  <background>
    <card>
      <p class="tag light-font">
        个人中心
      </p>
      <event-title>关注列表</event-title>
      <p
        v-if="!subscriptionList || subscriptionList.length === 0"
        class="light-font"
      >
        您没有关注任何事件
      </p>
    </card>
    <subscription-card
      v-for="subscription of subscriptionList"
      :key="subscription.id"
      :subscription="subscription"
    />
    <page-foot />
  </background>
</template>

<script>
import SubscriptionCard from '~/components/EventSubscribe/SubscriptionCard.vue';

export default {
  components: {
    'subscription-card': SubscriptionCard,
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isClientAdmin;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    subscriptionList() {
      return this.$store.getters.getSubscriptionList;
    },
  },
  async asyncData({ store }) {
    await store.dispatch('getClient');
  },
  head() {
    return {
      title: '关注列表 - 浪潮，你的社会事件追踪工具',
    };
  },
};
</script>
