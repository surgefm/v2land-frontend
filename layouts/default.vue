<template>
  <div>
    <nuxt/>
    <logo class="logo" />
    <event-action />
  </div>
</template>

<style lang="scss">
  html {
    font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
    background-color: rgb(247, 246, 247);
    overflow-y: scroll;
  }

  body {
    overflow: auto !important;
    padding-right: inherit !important;
  }

  *, *:before, *:after {
    box-sizing: border-box;
    margin: 0;
  }
</style>
