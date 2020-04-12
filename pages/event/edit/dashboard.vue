<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="dashboard-left">
        <img
          class="dashboard-logo"
          src="~/static/icon.svg"
        >
        <span class="dashboard-event-name">{{ event.name }}</span>
      </div>
      <div class="dashboard-right">
        <nuxt-link
          class="return-button"
          :to="route"
        >
          <span class="text light-font">返回事件</span>
        </nuxt-link>
      </div>
    </div>

    <draggable
      v-model="newsList"
      :options="{group: 'cards'}"
      class="dashboard-cards"
    >
      <div class="dashboard-card">
        <h3>搜索新闻</h3>
      </div>
      <div class="dashboard-card">
        <h3>备选新闻</h3>
        <draggable
          v-model="newsList"
          :options="{group: 'news'}"
        >
          <div
            v-for="news of newsList"
            :key="news.title"
            class="dashboard-subcard"
          >
            测试新闻 {{ typeof news.title === 'undefined' ? news : news.title }}
          </div>
        </draggable>
      </div>
      <div class="dashboard-card">
        <h3>备选进展</h3>
        <draggable
          v-model="testStackList"
          :options="{group: 'stacks'}"
        >
          <div
            v-for="stack of testStackList"
            :key="stack.title"
            class="dashboard-subcard"
          >
            {{ stack.title }}
          </div>
        </draggable>
      </div>
      <div class="dashboard-card">
        <h3>事件进展</h3>
        <draggable
          v-model="stackList"
          :options="{group: 'stacks'}"
        >
          <div
            v-for="stack of stackList"
            :key="stack.title"
            class="dashboard-subcard"
          >
            {{ stack.title }}
            <draggable
              v-model="stack.news"
              :options="{group: 'news'}"
            >
              <div
                v-for="news of stack.news"
                :key="news.title"
                class="dashboard-sub-subcard"
              >
                测试新闻 {{ news.title || news }}
              </div>
            </draggable>
          </div>
        </draggable>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data() {
    return {
      stackList: [],
      newsList: [],
      testStackList: [],
    };
  },
  computed: {
    route() {
      if (this.$route.params.pinyin) {
        return `/${this.$route.params.name}/${this.route.params.pinyin}}`;
      }
      return `/${this.$route.params.name}`;
    },
    event() {
      return this.$store.getters.getEvent(this.$route.params.name);
    },
  },
  async asyncData({ store, route }) {
    await store.dispatch('getEvent', route.params.name);
    return {
      stackList: await store.dispatch('fetchStackList', {
        where: {
          eventId: +route.params.name,
        },
      }),
    };
  },
  created() {
    for (let i = 0; i < 99; ++i) {
      this.newsList[this.newsList.length] = { title: i };
      this.testStackList[this.testStackList.length] = { title: '测试进展 ' + i };
    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  overflow-x: scroll;
  overflow-y: hidden;
}

.dashboard-header {
  width: 100vw;
  height: 2.5rem;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(270deg, rgba(25, 181, 254, .25), rgba(128, 207, 224, .25));

  .dashboard-left {
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: 1rem;

    .dashboard-logo {
      height: 1.5rem;
    }

    .dashboard-event-name {
      margin-left: .5rem;
      font-size: 1.15rem;
      font-weight: 700;
      color: #2474a9;
    }
  }

  .dashboard-right {
    height: 100%;
    display: flex;
    align-items: center;
    margin-right: 1rem;

    .return-button {
      border-radius: .25rem;
      background-color: rgba(255, 255, 255, .5);
      padding: .5rem;
    }

    * {
      font-size: 1rem;
      line-height: 1rem;
    }
  }
}

.dashboard-cards {
  height: calc(100% - 2.5rem);
  margin-top: 2.5rem;
  padding: 1rem 1rem .75rem 1rem;
  white-space: nowrap;
  overflow-x: auto;

  .dashboard-card {
    width: 22rem;
    display: inline-flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    min-width: 22rem;
    border-radius: .5rem;
    max-height: 100%;
    padding: 0 .5rem .75rem .5rem;
    margin-right: .5rem;
    background-color: rgb(205, 233, 245);

    h3 {
      padding: .5rem 0 0 .25rem;
      background-color: rgb(205, 233, 245);
      position: sticky;
      top: 0;
    }
  }

  .dashboard-card:last-child {
    margin-right: 0;
  }

  .dashboard-subcard {
    width: 100%;
    background-color: #fff;
    border-radius: .25rem;
    margin: .25rem 0;
    padding: .125rem .5rem;
    white-space: normal;
    line-height: 1.5;
    cursor: pointer;

    .dashboard-sub-subcard {
      width: 100%;
      background-color: rgba(0, 0, 0, .05);
      line-height: 1.5;
      padding: .25rem .5rem;
      border-radius: .25rem;
      margin: .25rem 0;
      cursor: pointer;
    }
  }
}

</style>
