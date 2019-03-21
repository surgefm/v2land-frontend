<template>
  <div class="post-sidebar">
    <div class="post-sidebar__inner">
      <div class="post-nav">
        <div class="nav-head">
          {{ detail.name }}
        </div>
        <div class="nav-body">
          <div
            v-for="(event, index) in stackCollection"
            :key="index"
            class="nav-item"
            :class="{'is-active': currentId === event.id}"
            @click="fnClick(event)"
          >
            <a href="javascript:void(0);">{{ event.title }}</a>
            <span>{{ stackCollection.length - index }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const GAP_HEIGHT = 50; // 距离可视区域顶部空隙
export default {
  name: 'Sidebar',
  props: {
    detail: Object,
    stackCollection: Array,
  },
  data() {
    return {
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
    setTimeout(() => {
      const eventId = this.hash.slice(1);
      if (this.hash) {
        const top = document.getElementById(eventId).offsetTop;
        window.scrollTo({
          top: top - GAP_HEIGHT,
          behavior: 'smooth',
        });
      }
      // 获取进展所有文档高度
      const stackOffsetTops = [];
      this.stackCollection.forEach(event => {
        const offsetTop = document.getElementById(`i${event.id}`).offsetTop;
        stackOffsetTops.push(offsetTop);
      });
      const stackLength = stackOffsetTops.length;
      window.onscroll = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scroll = scrollTop + 80;
        stackOffsetTops.forEach((top, index) => {
          if (scroll < stackOffsetTops[stackLength - 1] &&
            scroll + GAP_HEIGHT >= top && scroll <= stackOffsetTops[index + 1]) {
            self.hash = `#i${self.stackCollection[index]['id']}`;
          }
        });
      };
    }, 0);
  },
  methods: {
    fnClick(event) {
      this.hash = `#i${event.id}`;
      const top = document.getElementById(`i${event.id}`).offsetTop;
      window.scrollTo({
        top: top - GAP_HEIGHT,
        behavior: 'smooth',
      });
      setTimeout(() => this.$emit('fnLight', event), 500);
    },
  },
};
</script>


<style lang="scss" scoped>
  .post-sidebar {
    position: fixed;
    display: flex;
    top: 7rem;
    left: 0;
    width: 100%;
    justify-content: center;
    &__inner {
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      max-width: 72rem;
    }
  }
  .post-nav {
    width: 240px;
    max-height: 460px;
    .nav-head {
      padding: 10px 15px;
      line-height: 1.2;
      border-right: 1px solid #eee;
      color: #1e8bc3;
      font-size: 18px;
      text-align: right;
    }
    .nav-body {
      position: relative;
      max-height: 460px;
      overflow: scroll;
      scroll-behavior: smooth;
      border-right: 1px solid #eee;
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
      border-right: 2px solid #1e8bc3;
      transition: ease .3s;
    }
    .nav-item {
      position: relative;
      display: flex;
      justify-content: flex-end;
      height: 25px;
      border-right: 2px solid transparent;
      transition: ease .3s;
      font-size: 12px;
      color: #404040;
      >a {
        display: block;
        height: 25px;
        line-height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        color: inherit;
        transition: ease .3s;
      }
      >span {
        padding: 0 10px;
      }
      &.is-active {
        border-right: 2px solid #1e8bc3;
        // animation: 1s linear 0s alternate emphasize;
        >a {
          color: #1e8bc3;
        }
      }
      &:hover {
        border-right: 2px solid #1e8bc3;
        >a {
          color: #1e8bc3;
        }
      }
    }
  }
  @media (max-width: 1175px) {
    .post-nav {
      display: none;
    }
  }
</style>

