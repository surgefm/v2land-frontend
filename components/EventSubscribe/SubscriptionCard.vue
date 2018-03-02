<template>
  <card class="card hover">
    <el-popover
      ref="popover"
      placement="bottom"
      width="160"
      v-model="isPopoverVisible"
    >
      <p style="text-align:center">确认取消关注？</p>
      <div style="text-align: center; margin: 0">
        <el-button
          size="mini"
          type="text"
          @click="isPopoverVisible = false"
        >
          算了
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="unsubscribe"
        >
          确认
        </el-button>
      </div>
    </el-popover>

    <nuxt-link class="subscription-title link" :to="'/' + subscription.eventName">
      {{ subscription.eventName }}
    </nuxt-link>
    <div class="subscription-description">
      <p>订阅模式：{{ mode }}</p>
      <p>通知方式：{{ method }}</p>
    </div>
    <div class="subscription-action">
      <el-button
        type="text"
        v-popover:popover
        :loading="isSubmitting"
      >
        取消关注
      </el-button>
    </div>
  </card>
</template>

<script>
  import $ from 'postman-url-encoder';

  export default {
    props: {
      subscription: Object,
    },
    data() {
      return {
        isSubmitting: false,
        isPopoverVisible: false,
      };
    },
    computed: {
      mode() {
        const cases = [{
          label: '每当有新的新闻时提醒我',
          value: 'new',
        }, {
          label: '从现在起每周提醒我',
          value: 'weekly',
        }, {
          label: '每当事件有七天没有新的新闻时提醒我',
          value: '7DaysSinceLatestNews',
        }];

        const mode = cases.filter((c) => c.value === this.subscription.mode);
        if (mode.length > 0) {
          return mode[0].label;
        } else {
          return this.subscription.mode;
        }
      },
      method() {
        const methods = [
          {
            label: '邮件推送',
            value: 'email',
          },
          {
            label: '通过我的 Twitter 账号发推',
            value: 'twitter',
          },
          {
            label: '在 Twitter 上 @ 我',
            value: 'twitterAt',
          },
          {
            label: '通过我的微博账号发布微博',
            value: 'weibo',
          },
        ];

        const method = methods.filter((m) => m.value === this.subscription.contact.method);
        if (method.length > 0) {
          return method[0].label;
        } else {
          return this.subscription.contact.method;
        }
      },
    },
    methods: {
      unsubscribe() {
        this.isPopoverVisible = false;
        this.isSubmitting = true;
        const url = 'subscriptions/unsubscribe?id=' + this.subscription.unsubscribeId;
        this.$axios.get($.encode(url))
          .then(() => {
            this.$store.dispatch('getSubscriptions')
              .then(() => {
                this.$message.success('成功取消关注');
                this.isSubmitting = false;
              });
          })
          .catch(() => {
            this.$message.error('取消关注失败');
            this.isSubmitting = false;
          });
      },
    },
  };
</script>

<style lang="scss" scoped>
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
