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
};
</script>

<style lang="scss" scoped>

</style>
