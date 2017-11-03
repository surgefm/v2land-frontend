<template>
  <div class="action-set-container">
    <event-action-subscribe class="action"></event-action-subscribe>
    <event-action-post class="action"></event-action-post>
    <event-action-admit v-if="isClientAdmin" class="action"></event-action-admit>
    <event-action-edit v-if="isClientAdmin" class="action small"></event-action-edit>
    <event-action-edit-image v-if="isClientAdmin" class="action small"></event-action-edit-image>
    <event-action-return v-if="showReturn" class="action"></event-action-return>
    <event-action-homepage v-if="!showReturn" class="action"></event-action-homepage>
  </div>
</template>

<script>
  import EventActionSubscribe from './EventActionSubscribe.vue'
  import EventActionPost from './EventActionPost.vue'
  import EventActionAdmit from './EventActionAdmit.vue'
  import EventActionEdit from './EventActionEdit.vue'
  import EventActionEditImage from './EventActionEditImage.vue'
  import EventActionReturn from './EventActionReturn.vue'
  import EventActionHomepage from './EventActionHomepage.vue'

  export default {
    components: {
      'event-action-subscribe': EventActionSubscribe,
      'event-action-post': EventActionPost,
      'event-action-admit': EventActionAdmit,
      'event-action-edit': EventActionEdit,
      'event-action-edit-image': EventActionEditImage,
      'event-action-return': EventActionReturn,
      'event-action-homepage': EventActionHomepage
    },
    computed: {
      isClientAdmin () {
        return this.$store.getters.isClientAdmin
      },
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
    position: relative;
  }

  .action:first-child {
    margin-top: 0;
  }

  @media (max-width: 600px) {
    .action-set-container {
      flex-direction: row;
      top: initial;
      bottom: 0;
      right: 0;
      width: 100%;
      background-color: rgba(256, 256, 256, .95);
      justify-content: space-between;
    }

    .action {
      flex-grow: 1;
      padding: .25rem .25rem;
      margin: 0;
      justify-content: center;
    }

    .small {
      display: none;
    }
  }
</style>
