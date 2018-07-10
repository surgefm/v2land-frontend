<template>
  <background>
    <card class="center">
      <event-title>未找到该页面</event-title>
      <span class="explain light-font">
        我们未能找到那朵浪花 - 404 Not Found
      </span>
      <span>你所访问的页面不存在，或已被社区管理员移除</span>
      <div class="button">
        <nuxt-link to="/">
          <el-button>返回首页</el-button>
        </nuxt-link>
      </div>
    </card>
  </background>
</template>

<style lang="scss" scoped>
  @import '../assets/variables.scss';

  .center {
    display: flex !important;
    flex-direction: column;
  }

  .explain {
    font-size: 14px;
    line-height: 1.2;
    margin-bottom: .5rem;
  }

  .button {
    display: flex;
    justify-content: flex-end;
    margin-top: .75rem;
  }
</style>
