<template>
  <div class="inline">
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      class="comment-news"
    >
      <div slot="title" />
      <event-news-content v-if="news" :news="news" mode="quote" />
    </el-dialog>

    <span class="news" v-if="news" @click="dialogVisible = true">《{{ news.title }}》</span>
    <span class="news error" v-else-if="error">该新闻不存在或被隐藏</span>
    <span class="news loading" v-else><i class="el-icon-loading" /> 新闻加载中</span>
  </div>
</template>

<script>
export default {
  props: {
    content: Number,
  },
  data() {
    return {
      news: null,
      error: false,
      dialogVisible: false,
    };
  },
  async created() {
    try {
      this.news = await this.$store.dispatch('getNews', this.content);
    } catch (err) {
      console.error(err);
      this.error = true;
    }
  },
};
</script>

<style lang="scss" scoped>
  @import '../../assets/variables.scss';

  .news {
    color: $light-color;
    font-size: .8rem;
    background-color: $light-background;
    border-radius: .125rem;
    padding: .25rem;
    margin: 0;
    cursor: pointer;
  }

  .news.loading {
    padding: .25rem .35rem;
  }

  .news.error {
    background-color: $error-background;
    padding: .25rem .35rem;
    color: $error-color;
  }

  .news:hover {
    padding-bottom: .125rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: .125rem solid $light-color;
  }

  .news.error:hover {
    border-bottom-color: $error-color;
  }
</style>
