<template>
  <draggable v-model="stackList">
    <event-stack-card
      v-for="stack of stackList"
      :key="stack.id"
      :stack="stack"
    />
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import EventStackCard from '~/components/EventStack/EventStackCard.vue';

export default {
  props: {
    'event': Object,
  },
  data() {
    return {
      stackList: [],
    };
  },
  async created() {
    this.stackList = await this.$store.dispatch('fetchStackList', {
      where: {
        event: this.event.id,
      },
    });
  },
  components: {
    draggable,
    'event-stack-card': EventStackCard,
  },
};
</script>

<style lang="scss" scoped>

</style>
