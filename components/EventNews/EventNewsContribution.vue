<template>
  <p v-if="!data">
    <i class="el-icon-loading" /> 正在加载中
  </p>
  <div v-else>
    <p class="start">
      起源
    </p>
    <div>
      <div
        v-for="contrib of contributions"
        :key="contrib.id"
        class="contribution-item"
      >
        <div class="timeline">
          <div class="line" />
          <div class="indicator">
            <div class="circle" />
          </div>
          <div class="line" />
        </div>
        <p class="contribution-text">
          <el-tooltip
            :content="getDate(contrib.createdAt, true)"
            placement="top"
          >
            <span class="date">{{ getDate(contrib.createdAt) }}</span>
          </el-tooltip>
          <br>
          <span class="light-font">{{ contrib.client ? contrib.client.username : '游客' }} </span>
          <span v-if="contrib.action === 'createNews'">投稿了该新闻</span>
          <span v-else-if="contrib.action === 'updateNewsStatus'">将状态改为
            <span class="light-font">{{ getStatus(contrib.data) }}</span>
          </span>
        </p>
      </div>
    </div>
    <p class="end">
      现在
    </p>
  </div>
</template>

<script>
import getLocalTime from '~/utils/getLocalTime.js';

export default {
  props: {
    news: Object,
  },
  data() {
    return {
      data: null,
    };
  },
  computed: {
    contributions() {
      if (!this.data) return null;
      return this.data.contribution.filter((c) => {
        return ['createNews', 'updateNewsStatus'].includes(c.action);
      });
    },
  },
  async created() {
    this.data = await this.$store.dispatch('getNews', this.news.id);
  },
  methods: {
    getDate(input, full = false) {
      const date = getLocalTime(input);
      if (isNaN(date.getTime())) {
        return '';
      }

      const current = new Date();
      let string = '';
      if (date.getFullYear() !== current.getFullYear()) {
        string += date.getFullYear() + ' 年 ';
      }

      string += (date.getMonth() + 1) + ' 月 ';
      string += date.getDate() + ' 日 ';

      if (full) {
        string = '北京时间 ' + string;
        string += date.getHours() + ' 时 ';
        string += date.getMinutes() + ' 分';
      }
      return string;
    },
    getStatus(input) {
      const status = input.status || input;
      switch (status) {
      case 'admitted':
        return '审核通过';
      case 'pending':
        return '待审核';
      case 'rejected':
        return '拒绝';
      case 'removed':
        return '隐藏';
      default:
        return '未知状态';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "../../assets/variables.scss";

  .start, .end {
    line-height: 1.5;
    font-size: .75rem;
  }

  .end {
    padding-top: .2rem;
  }

  .contribution-item {
    color: #333;
    position: relative;
  }

  .contribution-text {
    margin-top: .1rem;
    margin-left: 2rem;
    line-height: 1.5;
    word-wrap: break-word;
    padding-bottom: .5rem;
    padding-top: .4rem;
  }

  .contribution-text * {
    line-height: 1.5;
    word-wrap: break-word;
  }

  .contribution-text .date {
    color: #888;
    font-size: 12px;
  }

  .timeline {
    position: absolute;
    left: .5;
    top: 0;
    height: 100%;
  }

  .indicator {
    width: 1.5rem;
    height: 1.58rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .indicator .circle {
    background-color: #fff;
    width: .75rem;
    height: .75rem;
    margin-bottom: .07rem;
    border-radius: 50%;
    border: $light-color .15rem solid;
  }

  .line {
    width: .18rem;
    background-color: $light-color;
    position: absolute;
    left: .66rem;
  }

  .line:first-child {
    height: .67rem;
  }

  .line:last-child {
    top: 1.6rem;
    height: calc(100% - 1.5rem);
  }

  .line:first-child,
  .contribution-item:last-child .line:last-child {
    border-bottom-left-radius: .09rem;
    border-bottom-right-radius: .09rem;
  }

  .line:last-child,
  .contribution-item:first-child .line:first-child {
    border-top-left-radius: .09rem;
    border-top-right-radius: .09rem;
  }
</style>
