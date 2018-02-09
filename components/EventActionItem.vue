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
    props: {
      action: String,
      type: String
    },
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
    render: function (createElement) {
      return createElement(this.action, { class: this.type || 'action' })
    }
  }
</script>
