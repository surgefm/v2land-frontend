<script>
  import EventActionAdminEvent from './EventActionAdminEvent.vue';
  import EventActionAdminAdmit from './EventActionAdminAdmit.vue';
  import EventActionAdminClient from './EventActionAdminClient.vue';
  import EventActionCreateEvent from './EventActionCreateEvent.vue';
  import EventActionSubscribe from './EventActionSubscribe.vue';
  import EventActionPost from './EventActionPost.vue';
  import EventActionAdmit from './EventActionAdmit.vue';
  import EventActionEdit from './EventActionEdit.vue';
  import EventActionEditStack from './EventActionEditStack.vue';
  import EventActionSubscriptionList from './EventActionSubscriptionList.vue';
  import EventActionClientSetting from './EventActionClientSetting.vue';
  import EventActionClient from './EventActionClient.vue';
  import EventActionReturn from './EventActionReturn.vue';
  import EventActionHomepage from './EventActionHomepage.vue';

  export default {
    props: {
      action: String,
      type: String,
    },
    components: {
      'event-action-admin-event': EventActionAdminEvent,
      'event-action-admin-admit': EventActionAdminAdmit,
      'event-action-admin-client': EventActionAdminClient,
      'event-action-create-event': EventActionCreateEvent,
      'event-action-subscribe': EventActionSubscribe,
      'event-action-post': EventActionPost,
      'event-action-admit': EventActionAdmit,
      'event-action-edit': EventActionEdit,
      'event-action-edit-stack': EventActionEditStack,
      'event-action-subscription-list': EventActionSubscriptionList,
      'event-action-client-setting': EventActionClientSetting,
      'event-action-client': EventActionClient,
      'event-action-return': EventActionReturn,
      'event-action-homepage': EventActionHomepage,
    },
    render: function(createElement) {
      return createElement(this.action, { class: this.type || 'action' });
    },
  };
</script>
