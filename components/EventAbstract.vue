<template>
  <card>
    <event-title>雷洋事件</event-title>
    <event-status :time="time"></event-status>
    <event-description>雷洋事件是 2016 年 5 月 7 日晚在中华人民共和国北京市昌平区发生的一起非正常死亡事件。昌平区公安分局东小口派出所便衣警察怀疑市民雷洋有嫖娼行为，在拘捕过程中雷洋逃脱后被再次拘捕，押解途中雷洋死亡。次日，该事件发布到网络，引起了舆论的广泛关注，并引发了对警方执法的大规模质疑，媒体和警方在事件中前后矛盾的表述也引发了争议。</event-description>
    <div class="event-share">
      <event-share></event-share>
    </div>
  </card>
</template>

<script>
  import Card from '~/components/Card.vue'
  import EventTitle from '~/components/EventTitle.vue'
  import EventStatus from '~/components/EventAbstractStatus.vue'
  import EventDescription from '~/components/EventAbstractDescription.vue'
  import EventShare from '~/components/EventAbstractShare.vue'

  export default {
    components: {
      Card,
      'event-title': EventTitle,
      'event-status': EventStatus,
      'event-description': EventDescription,
      'event-share': EventShare
    },
    data () {
      return {
        time: {
          startTime: '5/7/2017',
          lastTime: '10/27/2017'
        }
      }
    }
  }
</script>

<style scoped>
  .event-share {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 3rem;
  }
</style>
