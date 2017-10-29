<template>
  <div class="action-set-container">
    <event-action-subscribe class="action"></event-action-subscribe>
    <event-action-post class="action"></event-action-post>
    <event-action-return v-if="showReturn" class="action"></event-action-return>
  </div>
</template>

<script>
  import EventActionSubscribe from './EventActionSubscribe.vue'
  import EventActionPost from './EventActionPost.vue'
  import EventActionReturn from './EventActionReturn.vue'

  export default {
    components: {
      'event-action-subscribe': EventActionSubscribe,
      'event-action-post': EventActionPost,
      'event-action-return': EventActionReturn
    },
    computed: {
      showReturn () {
        return this.$route.name !== 'name'
      }
    }
  }
</script>

<style scoped>
  .action-set-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: fixed;
    top: 2.5rem;
    right: 2.5rem;
    z-index: 1100;
  }

  .subscribe-container {
    display: flex;
    align-items: center;
    padding: .5rem .75rem;
    transition: all .2s;
    cursor: pointer;
  }

  .action {
    margin-top: .5rem;
  }

  .action:first-child {
    margin-top: 0;
  }
</style>
