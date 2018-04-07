<template>
  <div class="share">
    <i class="el-icon-edit border-color" @click="edit" />
    <i class="el-icon-error border-color" @click="admit('rejected')" />
    <i class="el-icon-success border-color" @click="admit('admitted')" />
  </div>
</template>

<script>
  export default {
    props: {
      news: Object,
    },
    methods: {
      edit() {
        const name = this.$route.name === 'admin-admit'
          ? 'admin-news-edit'
          : 'event-edit-news';
        this.$router.push({
          name,
          params: { id: this.news.id },
        });
      },
      async admit(result) {
        await this.$store.dispatch('editNews', {
          data: { status: result },
          id: this.news.id,
        });
  
        this.$emit(result);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/variables.scss";

  .share {
    display: flex;
    margin-top: .25rem;
    font-size: 2rem;
    align-items: center;
  }

  .border-color {
    padding: .4rem;
    margin: 0 .2rem;
    transition: all .2s;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .border-color:before {
    color: rgb(129, 207, 224);
    transition: all .2s;
  }

  .el-icon-edit:before {
    font-size: 1.5rem;
  }

  .el-icon-edit:hover:before {
    color: rgb(20, 148, 177);
  }

  .el-icon-error:hover:before {
    color: #fa5555;
  }

  .el-icon-success:hover:before {
    color: #67c23a;
  }
</style>
