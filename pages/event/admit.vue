<template>
  <background>
    <card>
      <p class="tag light-font" v-if="!isAdminAdmit">{{ name }}</p>
      <event-title>审核新闻队列</event-title>
      <p v-if="!(newsCollection.length > 0)">
        队列暂空
      </p>
    </card>
    <div
      v-for="(news, i) of newsCollection"
      :key="news.id"
      :class="['news', 'news-' + i]"
      :id="news.id"
    >
      <event-news
        :news="news"
        :event="event"
        mode="admit"
        :order="Number(i) + 1"
        v-on:admitted="update('admitted')"
        v-on:rejected="update('rejected')"
      />
    </div>
    <page-foot />
  </background>
</template>

<script>
  import EventNews from '~/components/EventNews/EventNews.vue';

  export default {
    computed: {
      name() {
        return this.event ? this.event.name : null;
      },
      event() {
        return this.$store.getters.getEvent(this.$route.params.name);
      },
      newsCollection() {
        if (this.isAdminAdmit) {
          return this.$store.getters.getPendingNews();
        } else {
          return this.$store.getters.getPendingNews(this.name);
        }
      },
      isAdminAdmit() {
        return this.$route.name === 'admin-admit';
      },
    },
    methods: {
      async update(status) {
        if (this.isAdminAdmit) {
          await this.$store.dispatch('getPendingNews');
          this.response(status);
        } else {
          await this.$store.dispatch('getPendingNews', this.$route.params.name);
          await this.$store.dispatch('fetchEvent', this.$route.params.name);
          this.response(status);
        }
      },
      response(status) {
        if (status === 'admitted') {
          this.$message('已将该新闻放入事件新闻合辑内');
        } else {
          this.$message('已拒绝该新闻');
        }
      },
    },
    async asyncData({ store, route }) {
      if (route.name === 'admin-admit') {
        return store.dispatch('getPendingNews');
      } else {
        return store.dispatch('getPendingNews', route.params.name);
      }
    },
    components: {
      'event-news': EventNews,
    },
  };
</script>

<style lang="scss" scoped>
  .news {
    width: 100%;
    max-width: 35rem;
  }

  .news-0 {
    margin-top: 1rem;
  }
</style>
