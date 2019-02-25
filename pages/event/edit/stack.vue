<template>
  <background>
    <card>
      <p class="tag light-font">
        {{ name }}
      </p>
      <div class="title-container">
        <event-title>管理进展</event-title>
        <i
          :class="reversed ? 'el-icon-sort-down' : 'el-icon-sort-up'"
          @click="reversed = !reversed"
        />
      </div>
      <event-stack-arrange
        :event="event"
        :reversed="reversed"
      />
    </card>
    <page-foot />
  </background>
</template>

<script>
import EventStackArrange from '~/components/EventStack/EventStackArrange.vue';

export default {
  components: {
    'event-stack-arrange': EventStackArrange,
  },
  data() {
    return {
      reversed: false,
    };
  },
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
  head() {
    return {
      title: '管理进展 - ' + (this.name || '浪潮'),
    };
  },
};
</script>

<style lang="scss" scoped>
  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title-container i {
    font-size: 2rem;
    cursor: pointer;
  }

  i.el-icon-sort-down {
    transform: translateX(1rem);
  }
</style>
