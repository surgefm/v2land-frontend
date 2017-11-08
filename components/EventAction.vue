<template>
  <div class="action-set-container">
    <div class="center">
      <event-action-admin-event v-if="showAdminEvent" class="action" />
      <event-action-admin-admit v-if="showAdminAdmit" class="action" />
      <event-action-create-event v-if="showCreateEvent" class="action small" />
      <event-action-subscribe v-if="showSubscribe" class="action" />
      <event-action-post v-if="showPost" class="action" />
      <event-action-admit v-if="showAdmit" class="action" />
      <event-action-edit v-if="showEdit" class="action small" />
      <event-action-edit-image v-if="showEditImage" class="action small" />
      <event-action-subscription-list v-if="showSubscriptionList" class="action small" />
      <event-action-client v-if="showClient" class="action small" />
      <event-action-return v-if="showReturn" class="action" />
      <event-action-homepage v-if="showHomepage" class="action" />
    </div>
  </div>
</template>

<script>
  import EventActionAdminEvent from './EventActionAdminEvent.vue'
  import EventActionAdminAdmit from './EventActionAdminAdmit.vue'
  import EventActionCreateEvent from './EventActionCreateEvent.vue'
  import EventActionSubscribe from './EventActionSubscribe.vue'
  import EventActionPost from './EventActionPost.vue'
  import EventActionAdmit from './EventActionAdmit.vue'
  import EventActionEdit from './EventActionEdit.vue'
  import EventActionEditImage from './EventActionEditImage.vue'
  import EventActionSubscriptionList from './EventActionSubscriptionList'
  import EventActionClient from './EventActionClient.vue'
  import EventActionReturn from './EventActionReturn.vue'
  import EventActionHomepage from './EventActionHomepage.vue'

  export default {
    components: {
      'event-action-admin-event': EventActionAdminEvent,
      'event-action-admin-admit': EventActionAdminAdmit,
      'event-action-create-event': EventActionCreateEvent,
      'event-action-subscribe': EventActionSubscribe,
      'event-action-post': EventActionPost,
      'event-action-admit': EventActionAdmit,
      'event-action-edit': EventActionEdit,
      'event-action-edit-image': EventActionEditImage,
      'event-action-subscription-list': EventActionSubscriptionList,
      'event-action-client': EventActionClient,
      'event-action-return': EventActionReturn,
      'event-action-homepage': EventActionHomepage
    },
    computed: {
      isClientAdmin () {
        return this.$store.getters.isClientAdmin
      },
      isHomepage () {
        return this.$route.path === '/'
      },
      isAdminDir () {
        return this.$route.path.includes('/admin')
      },
      isSubscriptionPage () {
        return this.$route.path === '/subscription'
      },
      isLoggedIn () {
        return this.$store.getters.isLoggedIn
      },
      showAdminEvent () {
        return ((this.isHomepage || this.isSubscriptionPage) && this.isClientAdmin) ||
          this.isAdminDir
      },
      showAdminAdmit () {
        return this.showAdminEvent
      },
      showCreateEvent () {
        return this.isHomepage || this.isAdminDir
      },
      showSubscribe () {
        return !this.isHomepage && !this.isAdminDir && !this.isSubscriptionPage
      },
      showPost () {
        return this.showSubscribe
      },
      showAdmit () {
        return this.isClientAdmin && !this.isHomepage && !this.isAdminDir && !this.isSubscriptionPage
      },
      showEdit () {
        return this.showAdmit
      },
      showEditImage () {
        return this.showAdmit
      },
      showSubscriptionList () {
        return this.isLoggedIn
      },
      showClient () {
        return true
      },
      showReturn () {
        return this.$route.name !== 'name' &&
          !this.isHomepage &&
          !this.isAdminDir &&
          !this.isSubscriptionPage
      },
      showHomepage () {
        return !this.showReturn && !this.isHomepage
      }
    }
  }
</script>

<style scoped>
  .action-set-container {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 7rem;
    width: 100%;
    z-index: 1100;
    visibility: hidden;
  }

  .center {
    width: 100%;
    max-width: 53rem;
    padding-right: .5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    visibility: hidden;
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
    visibility: visible;
  }

  .action:first-child {
    margin-top: 0;
  }

  @media (max-width: 780px) {
    .center {
      max-width: 50rem;
    }
  }

  @media (max-width: 600px) {
    .action-set-container {
      top: initial;
      bottom: 0;
      right: 0;
      width: 100%;
    }

    .center {
      flex-direction: row;
      max-width: auto;
      visibility: visible;
      background-color: rgba(256, 256, 256, .95);
      justify-content: space-between;
      padding-right: 0;
    }

    .action {
      flex-grow: 1;
      padding: .25rem .25rem;
      margin: 0;
      justify-content: center;
      height: 2.5rem;
    }

    .small {
      display: none;
    }
  }
</style>
