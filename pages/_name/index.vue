<template>
  <div>
    <logo class="logo"></logo>
    <background>
      <first-screen :background="background">
        <event-abstract slot="header"></event-abstract>
      </first-screen>
      <div 
        v-for="(news, i) of newsCollection"
        :key="news.id"
        :class="['news-' + i]"
        :id="news.id"
      >
        <event-news :news="news" :order="i + 1"></event-news>
      </div>
    </background>
    <event-action></event-action>
  </div>
</template>

<script>
  import Logo from '~/components/Logo.vue'
  import Background from '~/components/Background.vue'
  import FirstScreen from '~/components/FirstScreen.vue'
  import Card from '~/components/Card.vue'
  import EventAbstract from '~/components/EventAbstract.vue'
  import EventNews from '~/components/EventNews.vue'
  import EventAction from '~/components/EventAction.vue'

  export default {
    data () {
      return {
        background: { url: '/default.jpg' },
        newsCollection: [
          {
            id: 1,
            tag: '最新消息',
            source: 'BBC 中文网',
            title: '雷洋事件：家属放弃诉讼 校友抗议检方裁决',
            content: '在雷洋家属收到中国司法机关决定不起诉涉嫌执法不当致死的警务人员之后六天，代表雷洋家属的维权律师陈有西透露，雷洋家属“决定放弃全部诉讼活动”。',
            date: '12/29/2016'
          }, {
            id: 2,
            source: 'BBC 中文网',
            title: '涉雷洋案警察被免诉 舆论反弹 当局紧张',
            content: '北京检察院周五表示免于对涉及雷洋案的五名警务人员起诉。这一决定出乎许多人意料，并再次引发热议。',
            date: '12/23/2016'
          }, {
            id: 3,
            source: '财新网',
            title: '雷洋家属指警方误导公众',
            content: '昌平警方凌晨发布案情通报指雷洋“嫖娼”，当事警员和“提供性服务”女性电视台露面披露案情；家属称已注意到相关报道，质疑警方误导公众，认为应等待检察机关调查结果',
            date: '5/11/2016'
          }
        ]
      }
    },
    components: {
      Logo,
      Background,
      Card,
      'first-screen': FirstScreen,
      'event-abstract': EventAbstract,
      'event-news': EventNews,
      'event-action': EventAction
    }
  }
</script>

<style scoped>
  .news-0 {
    margin-top: -2rem;
  }
</style>
