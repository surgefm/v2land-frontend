<template>
  <div class="homepage-container">
    <card class="title-container hover">
      <img
        src="https://s.langchao.co/750x200/default.jpg"
        onload="this.id = 'show'"
      >
      <event-title>浪潮</event-title>
      <event-description class="title-description">
        你的社会事件追踪工具
      </event-description>
      <div class="title-button-container">
        <nuxt-link to="/new">
          <el-button class="title-button">
            创建事件
          </el-button>
        </nuxt-link>
        <nuxt-link to="/about">
          <el-button class="title-button" type="primary">
            了解浪潮
          </el-button>
        </nuxt-link>
      </div>
    </card>
    <event-card
      v-for="event of eventCollection"
      :key="event.id"
      :event="event"
    />
    <page-foot class="page-foot" />
    <logo class="logo"></logo>
    <event-action></event-action>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        eventCollection: []
      }
    },
    async asyncData ({ store }) {
      return {
        eventCollection: await store.dispatch('getEventList')
      }
    }
  }
</script>

<style scoped>
  .homepage-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 7rem 1rem 1rem 1rem;
  }

  .title-container {
    display: block;
    position: relative;
    padding: 10.5rem 1.5rem .5rem 1.5rem !important;
  }

  .title-container img {
    width: 100%;
    height: 9rem;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
  }

  .title-description {
    margin-top: 0 !important;
  }

  .title-button-container {
    display: flex;
    justify-content: flex-end;
  }

  .title-button {
    margin: .5rem 0 1rem .5rem;
  }

  @media (max-width: 600px) {
    .homepage-container {
      padding: 4rem 1rem 1rem 1rem;
    }
  }
</style>
