<template>
  <div class="share">
    <i class="el-icon-error border-color" @click="admit('rejected')"></i>
    <i class="el-icon-success border-color" @click="admit('admitted')"></i>
  </div>
</template>

<script>
  export default {
    props: {
      news: Object
    },
    methods: {
      admit (result) {
        this.$store.dispatch('editNews', {
          data: { status: result },
          id: this.news.id
        }).then(() => {
          this.$emit('update')
        })
      }
    }
  }
</script>

<style scoped>
  .share {
    display: flex;
    margin-top: .25rem;
    font-size: 2rem;
  }

  .border-color {
    padding: .4rem;
    margin: 0 .2rem;
    transition: all .2s;
    cursor: pointer;
    border: transparent .25rem solid;
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .border-color:before {
    color: rgb(129, 207, 224);
    transition: all .2s;
  }

  .border-color:hover {
    border-color: rgb(52, 152, 219);
  }

  .el-icon-close:hover:before {
    color: #fa5555;
  }
  
  .el-icon-check:hover:before {
    color: #67c23a;
  }
</style>
