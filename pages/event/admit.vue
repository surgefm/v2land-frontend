<template>
  <background>
    <card>
      <p
        v-if="!isAdminAdmit"
        class="tag light-font"
      >
        {{ name }}
      </p>
      <event-title>审核新闻队列</event-title>
      <p v-if="!(newsCollection.length > 0)">
        队列暂空
      </p>
    </card>
    <div
      v-for="(news, i) of newsCollection"
      :id="news.id"
      :key="news.id"
      :class="['news', 'news-' + i]"
    >
      <event-news
        :news="news"
        :event="event"
        mode="admit"
        :order="Number(i) + 1"
        @admitted="update('admitted')"
        @rejected="update('rejected')"
      />
    </div>
    <page-foot />
  </background>
</template>

<script>
import EventNews from '~/components/EventNews/EventNews.vue';

export default {
  components: {
    'event-news': EventNews,
  },
  data() {
    return {
      newsCollection: [],
    };
  },
  computed: {
    name() {
      return this.event.name;
    },
    event() {
      return this.$store.getters.getEvent(this.$route.params.name);
    },
    isAdminAdmit() {
      return this.name === 'admin';
    },
  },
  async asyncData({ store, route }) {
    if (route.params.name === 'admin') {
      return { newsCollection: await store.dispatch('getPendingNews') };
    } else {
      await store.dispatch('getEvent', route.params.name);
      return {
        newsCollection: await store.dispatch('getPendingNews', route.params.name),
      };
    }
  },
  methods: {
    async update(status) {
      if (this.isAdminAdmit) {
        this.newsCollection = await this.$store.dispatch('getPendingNews');
        this.response(status);
      } else {
        this.newsCollection = await this.$store.dispatch('getPendingNews', this.$route.params.name);
        const { name } = this.$route.params;
        await this.$store.dispatch('fetchEvent', { name });
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
