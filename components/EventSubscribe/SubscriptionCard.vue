<template>
  <card class="card hover">
    <el-popover
      ref="popover"
      v-model="isPopoverVisible"
      placement="bottom"
      width="160"
    >
      <p style="text-align:center">
        确认取消全部关注？
      </p>
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

    <nuxt-link
      class="subscription-title link"
      :to="'/' + event.id"
    >
      {{ event.name }}
    </nuxt-link>
    <div class="subscription-description">
      <p>关注模式：{{ mode }}</p>
      <p>通知方式：</p>
      <div
        v-for="contact in contacts"
        :key="contact.label"
      >
        <el-checkbox
          v-if="contact.checked || showMoreContacts"
          v-model="contact.checked"
          :disabled="isSubmitting"
          @change="(newValue) => checkboxValueChanged(contact, newValue)"
        >
          {{ contact.label }}
        </el-checkbox>
      </div>
    </div>
    <div class="subscription-action">
      <el-button
        size="mini"
        round
        @click="showMoreContacts = !showMoreContacts"
      >
        {{ showMoreContacts ? '隐藏更多通知方式' : '显示更多通知方式' }}
      </el-button>
      <el-button
        v-popover:popover
        type="text"
        :loading="isSubmitting"
      >
        取消全部关注
      </el-button>
    </div>
  </card>
</template>

<script>
const methodCollection = [
  {
    label: '在微博上 @ 我',
    method: 'weiboAt',
    site: 'weibo',
  },
  {
    label: '在 Twitter 上 @ 我',
    method: 'twitterAt',
    site: 'twitter',
  },
  {
    label: '通过我的微博账号发布微博',
    method: 'weibo',
    site: 'weibo',
  },
  {
    label: '通过我的 Twitter 账号发推',
    method: 'twitter',
    site: 'twitter',
  },
  {
    label: '邮件推送',
    method: 'email',
  },
];

import $ from 'postman-url-encoder';

export default {
  props: {
    subscription: Object,
  },
  data() {
    return {
      isSubmitting: false,
      isPopoverVisible: false,
      event: {},
      contacts: [],
      showMoreContacts: false,
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
      }, {
        label: '每当有新的进展时提醒我',
        value: 'EveryNewStack',
      }, {
        label: '每周五提醒我',
        value: 'EveryFriday',
      }, {
        label: '在事件有 30 天没有新消息时提醒我',
        value: '30DaysSinceLatestStack',
      }];

      const mode = cases.filter((c) => c.value === this.subscription.mode);
      if (mode.length > 0) {
        return mode[0].label;
      } else {
        return this.subscription.mode;
      }
    },
    client() {
      return this.$store.getters.getClient;
    },
    auths() {
      return this.client.auths || [];
    },
  },
  async created() {
    this.updateContactList();
    await this.getEvent();
  },
  methods: {
    async getEvent() {
      this.event = await this.$store.dispatch('getEvent', this.subscription.eventId);
    },
    updateContactList() {
      this.contacts = [];
      for (const method of methodCollection) {
        if (!method.site) {
          const contactItem = this.createContact(
            { ...method },
            this.checkIfSubscribed(method, this.subscription.contacts),
          );
          this.contacts.push(contactItem);
        } else {
          for (const auth of this.auths) {
            if (auth.site === method.site) {
              const contact = { ...method, authId: auth.id };
              const contactItem = this.createContact(
                contact,
                this.checkIfSubscribed(contact, this.subscription.contacts),
              );
              this.contacts.push(contactItem);
            }
          }
        }
      }
    },
    createContact(contact, checked) {
      if (!contact.site && contact.label) {
        return {
          ...contact,
          ...this.findSameContact(contact, this.subscription.contacts),
          checked,
        };
      }
      let username = '未知用户';
      let authId;
      for (const auth of this.auths) {
        if (auth.site === contact.site && auth.id === contact.authId) {
          username = auth.profile.screen_name;
          authId = auth.id;
          break;
        }
      }
      return {
        ...contact,
        ...this.findSameContact(contact, this.subscription.contacts),
        label: contact.label + '：' + username,
        [contact.site]: authId,
        checked,
      };
    },
    findSameContact(method, contacts) {
      for (const contact of contacts) {
        if (contact.method === method.method &&
          contact.authId == method.authId &&
          contact.status === 'active') {
          return contact;
        }
      }
      return null;
    },
    checkIfSubscribed(method, contacts) {
      return !!this.findSameContact(method, contacts);
    },
    async checkboxValueChanged(contact, newValue) {
      try {
        if (newValue === false) {
          await this.unsubscribe(contact);
        } else {
          await this.subscribe(contact);
        }
      } catch (err) {
        contact.checked = !newValue;
      } finally {
        this.updateContactList();
      }
    },
    async subscribe(contact) {
      this.isSubmitting = true;
      const url = 'subscription/' + this.event.id;
      const body = {
        mode: this.subscription.mode,
        contact,
      };
      await this.$axios.post(url, body);
      await this.$store.dispatch('getSubscriptions');
      this.isSubmitting = false;
      this.$message.success('成功添加通知方式');
    },
    async unsubscribe(contact) {
      this.isPopoverVisible = false;
      this.isSubmitting = true;
      let url = 'subscription/unsubscribe';
      url += contact
        ? `/contact?id=${contact.id}&unsubscribeId=${contact.unsubscribeId}`
        : `?id=${this.subscription.id}&unsubscribeId=${this.subscription.unsubscribeId}`;
      try {
        await this.$axios.get($.encode(url));
        await this.$store.dispatch('getSubscriptions');
        this.$message.success('成功取消关注');
        this.isSubmitting = false;
      } catch (err) {
        this.$message.error('取消关注失败');
        this.isSubmitting = false;
      }
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
    display: flex;
    justify-content: space-between;
  }

  p {
    text-decoration: none;
    color: black;
  }

  .show-more {
    cursor: pointer;
    font-weight: bold;
  }
</style>
