<template>
  <background>
    <card>
      <p class="tag light-font">{{ $route.params.name }}</p>
      <event-title>添加新闻</event-title>
      <event-news-information-form class="news-form"></event-news-information-form>
    </card>
    <event-action></event-action>
    <logo class="logo"></logo>
  </background>
</template>

<script>
  import Logo from '~/components/Logo.vue'
  import Background from '~/components/Background.vue'
  import Card from '~/components/Card.vue'
  import EventAction from '~/components/EventAction'
  import EventTitle from '~/components/EventTitle'
  import EventNewsInformationForm from '~/components/EventNewsInformationForm'

  export default {
    components: {
      Logo,
      Background,
      Card,
      'event-action': EventAction,
      'event-title': EventTitle,
      'event-news-information-form': EventNewsInformationForm
    }
  }
</script>

<style scoped>
  .tag {
    font-size: .9rem;
    margin-right: .5rem;
  }
 
  .news-form {
    margin-top: 1rem;
  }
</style>
