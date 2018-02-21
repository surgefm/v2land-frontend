<template>
  <div class="share">
    <a
      v-for="site of share"
      :href="shareTo(site)"
      :key="news.id + ': ' + site"
      onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;">
      <span :class="['icon-' + site, 'border-color', 'icon-container']" />
    </a>
    <div class="icon-container" v-if="isClientAdmin">
      <i class="el-icon-edit border-color" @click="edit" />
      <i class="el-icon-delete border-color" @click="remove" />
    </div>
  </div>
</template>

<script>
  import config from '~/const'
  import $ from 'postman-url-encoder'

  export default {
    props: {
      news: Object
    },
    data () {
      return {
        share: ['twitter', 'facebook', 'google-plus', 'weibo']
      }
    },
    computed: {
      isClientAdmin () {
        return this.$store.getters.isClientAdmin
      },
      event () {
        return this.$store.getters.getEvent(this.$route.params.name)
      }
    },
    methods: {
      shareTo (site) {
        let url = config.baseUrl + this.event.id + '?news=i' + this.news.id
        let message = this.news.title + ' - ' +
          this.news.abstract.slice(0, 50) +
          (this.news.abstract.length > 50 ? '… ' : ' ')

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
      },
      remove () {
        this.$store.dispatch('editNews', {
          id: this.news.id,
          data: { status: 'removed' }
        }).then(() => {
          this.$store.dispatch('fetchEvent', this.$route.params.name)
        }).then(() => {
          this.$message('已删除该新闻')
        })
      },
      edit () {
        this.$router.push(`/${this.$route.params.name}/edit/${this.news.id}`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/variables.scss";

  .share {
    display: flex;
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
    height: 2rem;
  }

  .icon-container {
    display: flex;
    align-items: center;
  }

  .border-color:before {
    color: rgb(129, 207, 224);
    transition: all .2s;
  }

  .border-color:hover {
    border-color: $light-color;
  }

  .el-icon-document:hover:before,
  .el-icon-delete:hover:before,
  .el-icon-edit:hover:before {
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
