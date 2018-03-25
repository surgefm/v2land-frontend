<template>
  <div 
    class="news card background-color news load-more"
    v-show="loadFlag"
    @click="loadMethod"
  >
    <span>
      <slot></slot>
      <i :class="loadIconClass?'el-icon-loading':'el-icon-refresh'"></i>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 2,
      loadIconClass: false,
      loadFlag: true,
    }
  },
  props: {
    type: String,
  },
  methods: {
    loadMethod() {
      if (this.type === 'news') {
        this.loadNews();
      } else if(this.type === 'event'){
        this.loadEvent();
      }
    },
    async loadNews() {
      this.loadIconClass = true;
      const event = Object.keys(this.$store.state.event);
      const id = this.$store.state.event[event[0]].id;
      const res = await this.$axios.post('/news',{
        page: this.page,
        where: {
          event: id,
          status: 'admitted',
        }
      });
      this.loadIconClass = false;
      if (res.data.newsList.length!=0) {
        await this.$store.dispatch('addNewList', res.data.newsList);
        this.page++;
      } else{
        this.$message.warning("己加载到底部!");
        this.loadFlag = false;
      }
    },
    async loadEvent() {
      this.loadIconClass = true;
      const res = await this.$axios.post('/event/list',{
        page: this.page,
        where: {
          status: 'admitted',
        }
      });
      this.loadIconClass = false;
      if (res.data.eventList.length!=0) {
        await this.$store.dispatch('addEventList', res.data.eventList);
        this.page ++;
      } else{
        this.$message.warning("己加载到底部!");
        this.loadFlag = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .news {
    width: 100%;
    max-width: 35rem;
  }

  .load-more {
    max-width: 35rem;
    width: 100%;
    display: block;
    padding: 0.5rem 2rem;
    margin-bottom: 1.25rem;
    border-radius: .5rem;
    z-index: 1000;
    box-shadow: none;
    transition: all .2s;
    text-align: center;
    cursor: pointer;
  }

  .load-more:hover {
    box-shadow: 0 10px 40px rgba(0, 0, 0, .075), 0 2.5px 10px rgba(0, 0, 0, .0375);
  }

  @media (max-width: 600px) {
    .card {
      padding: 1.5rem 1rem;
      box-shadow: 0 5px 5px rgba(0, 0, 0, .025) !important;
    }
  }
</style>
