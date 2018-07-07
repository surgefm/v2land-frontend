<template>
  <background>
    <card>
      <p class="tag light-font">{{ name }}</p>
      <event-title>管理进展</event-title>
      <event-stack-arrange :event="event" />
    </card>
    <page-foot />
  </background>
</template>

<script>
import EventStackArrange from '~/components/EventStack/EventStackArrange.vue';

export default {
  computed: {
    name() {
      if (!this.event) return '';
      return this.event.name;
    },
    event() {
      return this.$store.getters.getEvent(this.$route.params.name);
    },
  },
  async asyncData({ store, route }) {
    await store.dispatch('getEvent', route.params.name);
  },
  components: {
    'event-stack-arrange': EventStackArrange,
  },
  head() {
    return {
      title: '管理进展 - ' + (this.name || '浪潮'),
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
