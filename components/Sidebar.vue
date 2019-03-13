<template>
  <div class="post-nav">
    <div class="nav-head">
      {{ detail.name }}
    </div>
    <div class="nav-body">
      <!-- <div class="nav-line is-active" /> -->
      <div class="nav-list">
        <div
          v-for="(event, index) in stackCollection"
          :key="index"
          class="nav-item"
          :class="{'is-active': currentId === event.id}"
          @click="fnClick(event)"
        >
          <a :href="`#i${event.id}`">{{ index + 1 }}、{{ event.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    detail: Object,
    stackCollection: Array,
  },
  data() {
    return {
      // currentId: '',
      hash: this.$route.hash,
    };
  },
  computed: {
    currentId() {
      const currentId = +this.hash.slice(2);
      return currentId;
    },
  },
  mounted() {
    const self = this;
    window.onload = () => {
      const eventId = this.hash.slice(1);
      if (this.hash) {
        const top = document.getElementById(eventId).getBoundingClientRect().top;
        window.scrollTo({
          top: top + 1,
          behavior: 'smooth',
        });
      }
      // window.onhashchange = () => {}
      // 获取子事件所有文档高度
      const eventOffsetTops = [];
      this.stackCollection.forEach(event => {
        const offsetTop = document.getElementById(`i${event.id}`).offsetTop;
        eventOffsetTops.push(offsetTop);
      });
      const eventLength = eventOffsetTops.length;
      window.onscroll = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        eventOffsetTops.forEach((top, index) => {
          if (scrollTop < eventOffsetTops[eventLength - 1]) {
            if (scrollTop >= top && scrollTop <= eventOffsetTops[index + 1]) {
              self.hash = `#i${self.stackCollection[index]['id']}`;
            }
          }
        });
      };
    };
  },
  methods: {
    fnClick(event) {
      // this.currentId = event.id;
      this.hash = `#i${event.id}`;
    },
  },
};
</script>


<style lang="scss" scoped>
  .post-nav {
    // position: sticky;
    position: fixed;
    top: 7rem;
    right: 5rem;
    width: 280px;
    height: 460px;
    .nav-head {
      padding: 10px 15px;
      border-left: 1px solid #eee;
      color: #1e8bc3;
      font-size: 18px;
    }
    .nav-body {
      position: relative;
      height: 460px;
      overflow: scroll;
      scroll-behavior: smooth;
      border-left: 1px solid #eee;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .nav-line {
      position: absolute;
      display: block;
      left: 0px;
      right: 0px;
      height: 25px;
      border-left: 2px solid #1e8bc3;
      transition: ease .3s;
    }
    .nav-list {
      .nav-item {
        position: relative;
        height: 25px;
        border-left: 2px solid transparent;
        transition: ease .3s;
        >a {
          display: block;
          padding: 0 15px;
          height: 25px;
          line-height: 25px;
          color: #404040;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          cursor: pointer;
          transition: ease .3s;
        }
        &.is-active {
          border-left: 2px solid #1e8bc3;
          >a {
            color: #1e8bc3;
          }
        }
        &:hover {
          border-left: 2px solid #1e8bc3;
          >a {
            color: #1e8bc3;
          }
        }
      }
    }
  }
  @media (max-width: 600px) {
    .post-nav {
      display: none;
    }
  }
</style>

