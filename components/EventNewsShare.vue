<template>
  <div class="share">
    <i class="el-icon-share border-color"></i>
    <span class="icon-twitter border-color"></span>
    <span class="icon-facebook border-color"></span>
    <span class="icon-google-plus border-color"></span>
    <span class="icon-weibo border-color"></span>
  </div>
</template>

<style scoped>
  .share {
    display: flex;
    margin-top: .25rem;
    font-size: 1rem;
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

  .el-icon-share:hover:before {
    color: #336e7b;
  }

  .icon-weibo:hover:before {
    color: #e6162d;
  }

  .icon-google-plus:hover:before {
    color: #dc4e41;
  }

  .icon-facebook:hover:before {
    color: #3b5998;
  }

  .icon-twitter:hover:before {
    color: #1da1f2;
  }
</style>
