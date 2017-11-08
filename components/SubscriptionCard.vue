<template>
  <card class="card hover">
    <nuxt-link class="subscription-title link" :to="'/' + subscription.eventName">
      {{ subscription.eventName }}
    </nuxt-link>
    <div class="subscription-description">
      <p>订阅模式：{{ mode }}</p>
      <p>通知方式：{{ method }}</p>
    </div>
    <div class="subscription-action">
      <el-button type="text" @click="unsubscribe">取消关注</el-button>
    </div>
  </card>
</template>

<script>
  import $ from 'postman-url-encoder'
  import axios from '~/plugins/axios'

  export default {
    props: {
      subscription: Object
    },
    computed: {
      mode () {
        let cases = [{
          label: '每当有新的新闻时提醒我',
          value: 'new'
        }, {
          label: '从现在起每周提醒我',
          value: 'weekly'
        }, {
          label: '每当事件有七天没有新的新闻时提醒我',
          value: '7DaysSinceLatestNews'
        }]

        let mode = cases.filter(c => c.value === this.subscription.mode)
        if (mode.length > 0) {
          return mode[0].label
        } else {
          return this.subscription.mode
        }
      },
      method () {
        let methods = [
          {
            label: '邮件推送',
            value: 'email'
          },
          {
            label: '通过我的 Twitter 账号发推',
            value: 'twitter'
          },
          {
            label: '通过我的微博账号发布微博',
            value: 'weibo'
          }
        ]

        let method = methods.filter(m => m.value === this.subscription.contact.method)
        if (method.length > 0) {
          return method[0].label
        } else {
          return this.subscription.contact.method
        }
      }
    },
    methods: {
      unsubscribe () {
        let url = 'subscriptions/unsubscribe?id=' + this.subscription.unsubscribeId
        axios.get($.encode(url))
          .then(() => {
            this.$store.dispatch('getSubscriptions')
              .then(() => {
                this.$message.success('成功取消关注')
              })
          })
          .catch(() => {
            this.$message.error('取消关注失败')
          })
      }
    }
  }
</script>

<style scoped>
  .link {
    color: black !important;
  }

  .subscription-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.5;
  }

  .subscription-description {
    margin-top: .5rem;
  }

  .subscription-action {
    width: 100%;
    text-align: right;
  }

  p {
    text-decoration: none;
    color: black;
  }
</style>
