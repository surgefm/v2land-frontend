<template>
  <div class="status">
    <span v-if="time.startTime">
      起始时间：
      <span class="light-font">
        {{ getString(time.startTime) }}
      </span>
    </span>
    <span class="margin-left" v-if="time.lastTime">
      最后更新：
      <span class="light-font">
        {{ getString(time.lastTime) }}
      </span>
    </span>
    <span class="light-font" v-if="!time.startTime">
      尚无相关新闻
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      time: Object,
    },
    methods: {
      getString(input) {
        const date = new Date(input);
        if (isNaN(date.getTime())) {
          return null;
        }

        let string = '';
        string += date.getFullYear() + ' 年 ';
        string += (date.getMonth() + 1) + ' 月 ';
        string += date.getDate() + ' 日';

        return string;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .status {
    font-size: .9rem;
  }

  .margin-left {
    margin-left: .75rem;
  }

  @media (max-width: 600px) {
    .margin-left {
      margin-left: 0;
    }

    .status {
      display: flex;
      flex-direction: column;
    }
  }
</style>
