<template>
  <div class="share">
    <span class="border-color icon-twitter"></span>
    <span class="border-color icon-facebook"></span>
    <span class="border-color icon-google-plus"></span>
    <span class="border-color icon-weibo"></span>
  </div>
</template>

<style scoped>
  .share {
    display: flex;
    margin-top: .25rem;
    font-size: 1.25rem;
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

  .border-color:hover {
    border-color: rgb(52, 152, 219);
  }
</style>
