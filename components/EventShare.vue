<template>
  <div class="share">
    <el-popover
      ref="wechat-popover"
      placement="bottom"
      width="160"
      trigger="click"
    >
      <qrcode
        :value="url"
        :options="{ size: 480, foreground: '#333', level: 'H' }"
        tag="img"
        class="qrcode"
      />
      <p class="qrcode-text">微信扫码分享</p>
      <p class="qrcode-text light-font">iOS 用户可直接使用浏览器的分享功能进行分享</p>
    </el-popover>

    <a
      v-for="site of share"
      :href="shareTo(site)"
      :key="object.id + ': ' + site"
      onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;">
      <span
        :class="[
          'icon-' + site,
          type,
          'border-color',
          'icon-container'
        ]"
      />
    </a>
    <a v-popover:wechat-popover>
      <span :class="['icon-wechat', type, 'border-color', 'icon-container']" />
    </a>
    <div class="icon-container" v-if="type === 'news' && isClientAdmin">
      <i class="news el-icon-edit border-color" @click="edit" />
      <i class="news el-icon-delete border-color" @click="remove" />
    </div>
  </div>
</template>

<script>
  import config from '~/const';
  import $ from 'postman-url-encoder';

  export default {
    props: {
      object: Object,
      type: String,
    },
    data() {
      return {
        share: ['twitter', 'facebook', 'google-plus', 'weibo'],
      };
    },
    computed: {
      isClientAdmin() {
        return this.$store.getters.isClientAdmin;
      },
      event() {
        return this.$store.getters.getEvent(this.$route.params.name);
      },
      url() {
        if (this.type === 'event') {
          return config.baseUrl + this.object.id;
        } else if (this.type === 'news') {
          return config.baseUrl + this.event.id + '?news=' + this.object.id;
        }
      },
    },
    methods: {
      shareTo(site) {
        const url = this.url;
        let message = this.type === 'event'
          ? this.object.name + ' - ' +
            this.object.description.slice(0, 50) +
            (this.object.description.length > 50 ? '… ' : ' ')
          : this.object.title + ' - ' +
            this.object.abstract.slice(0, 50) +
            (this.object.abstract.length > 50 ? '… ' : ' ') +
            '来源：' + this.object.source + ' ';

        switch (site) {
        case 'twitter':
          return $.encode('https://twitter.com/intent/tweet?text=' + message +
              '&url=' + url +
              '&hashtags=' + this.$route.params.name + ',浪潮'
          );
        case 'facebook':
          return $.encode('https://www.facebook.com/sharer/sharer.php?u=' + url);
        case 'google-plus':
          return $.encode('https://plus.google.com/share?url=' + url);
        case 'weibo':
          message += `%23${this.$route.params.name}%23 %23浪潮，你的社会事件追踪工具%23`;
          return $.encode('http://service.weibo.com/share/share.php?url=' + url + '&title=' + message);
        }
      },
      remove() {
        this.$store.dispatch('editNews', {
          id: this.object.id,
          data: { status: 'removed' },
        }).then(() => {
          this.$store.dispatch('fetchEvent', this.$route.params.name);
        }).then(() => {
          this.$message('已删除该新闻');
        });
      },
      edit() {
        this.$router.push(`/${this.$route.params.name}/edit/${this.object.id}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .share {
    display: flex;
    font-size: 1rem;
    margin-top: 1rem;
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

  .news.border-color {
    background-color: none !important;
  }

  .event.border-color {
    border-radius: 100%;
    margin: 0 0 0 .1rem;
    padding: 14px;
    height: 3rem;
    width: 3rem;
    border: none;
  }

  .icon-container {
    display: flex;
    align-items: center;
  }

  .qrcode-text {
    text-align: center;
    user-select: none;
  }

  .light-font {
    font-size: .75rem;
    line-height: 1.5;
  }

  .qrcode {
    width: 100%;
    height: auto;
    opacity: 1;
  }

  .event {
    font-size: 1.25rem;
  }

  .news.border-color:before {
    color: rgb(129, 207, 224);
    transition: all .2s;
  }

  .el-icon-document:hover:before,
  .el-icon-delete:hover:before,
  .el-icon-edit:hover:before {
    color: #336e7b;
  }

  .news.icon-weibo:hover:before {
    color: #e6162d;
  }

  .news.icon-wechat:hover:before {
    color: #3eb94e;
  }

  .news.icon-google-plus:hover:before {
    color: #dc4e41;
  }

  .news.icon-facebook:hover:before {
    color: #3b5998;
  }

  .news.icon-twitter:hover:before {
    color: #1da1f2;
  }

  .icon-weibo:hover {
    background-color: rgba(230, 22, 46, .1);
    border-color: rgba(230, 22, 46, .1);
  }

  .icon-wechat:hover {
    background-color: rgba(62, 185, 78, .1);
    border-color: rgba(62, 185, 78, .1);
  }

  .icon-google-plus:hover {
    background-color: rgba(255, 106, 52, .1);
    border-color: rgba(255, 106, 52, .1);
  }

  .icon-facebook:hover {
    background-color: rgba(76, 119, 210, .1);
    border-color: rgba(76, 119, 210, .1);
  }

  .icon-twitter:hover {
    background-color: rgba(29, 161, 242, .1);
    border-color: rgba(29, 161, 242, .1);
  }
</style>
