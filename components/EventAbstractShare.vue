<template>
  <div class="share">
    <a
      v-for="site of share"
      :href="shareTo(site)"
      :key="event.id + ': ' + site"
      onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;"
    >
      <span :class="['icon-' + site, 'border-color', 'icon-container']" />
    </a>
  </div>
</template>

<script>
  import config from '~/const'
  import $ from 'postman-url-encoder'

  export default {
    props: {
      event: Object
    },
    data () {
      return {
        share: ['twitter', 'facebook', 'google-plus', 'weibo']
      }
    },
    methods: {
      shareTo (site) {
        let url = $.encode(config.baseUrl + this.event.id)
        let message = this.event.name + ' - ' +
          this.event.description.slice(0, 50) +
          (this.event.description.length > 50 ? '… ' : ' ')

        switch (site) {
          case 'twitter':
            return $.encode('https://twitter.com/intent/tweet?text=' + message +
              '&url=' + url +
              '&hashtags=' + this.$route.params.name + ',浪潮'
            )
          case 'facebook':
            return $.encode('https://www.facebook.com/sharer/sharer.php?u=' + url)
          case 'google-plus':
            return $.encode('https://plus.google.com/share?url=' + url)
          case 'weibo':
            return $.encode('http://service.weibo.com/share/share.php?url=' + url + '&title=' + message)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/variables.scss";

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
    border-color: $light-color;
  }
</style>
