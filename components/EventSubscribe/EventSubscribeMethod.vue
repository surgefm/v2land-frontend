<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="4.5rem"
    >
      <el-form-item
        label="提醒方法"
        prop="method"
      >
        <el-select
          v-model="form.method"
          placeholder="请选择通过什么方式提醒你"
          class="method-selector"
          @change="save"
        >
          <el-option
            v-for="method in methodCollection"
            :key="method.value"
            :label="method.label"
            :value="method.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.method === 'email'"
        label="邮箱地址"
        prop="email"
      >
        <span>{{ $store.getters.getClient.email }}</span>
      </el-form-item>
      <el-form-item
        v-else-if="['twitterAt', 'twitter'].includes(form.method)"
        label="Twitter ID"
        prop="twitter"
      >
        <el-select
          v-if="getTwitter[0]"
          v-model="form.twitter"
          placeholder="请选择 Twitter 账号"
          class="method-selector"
          @change="save"
        >
          <el-option
            v-for="account in getTwitter"
            :key="account.profileId"
            :label="`${account.profile.name} @${account.profile.screen_name}`"
            :value="account.id"
          />
        </el-select>
        <el-button
          v-else
          type="primary"
          plain
          @click="connectTwitter"
        >
          绑定 Twitter 账号
        </el-button>
      </el-form-item>
      <el-form-item
        v-else-if="['weiboAt', 'weibo'].includes(form.method)"
        label="微博账号"
        prop="weibo"
      >
        <el-select
          v-if="getWeibo[0]"
          v-model="form.weibo"
          placeholder="请选择微博账号"
          class="method-selector"
          @change="save"
        >
          <el-option
            v-for="account in getWeibo"
            :key="account.profileId"
            :label="`@${account.profile.name}`"
            :value="account.id"
          />
        </el-select>
        <el-button
          v-else
          type="primary"
          plain
          @click="connectWeibo"
        >
          绑定微博账号
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import config from '~/const';
import $ from 'postman-url-encoder';

export default {
  data() {
    return {
      form: {
        method: 'weiboAt',
        email: '',
        twitter: '',
        weibo: '',
      },
      rules: {
        method: [
          { required: true, message: '请选择提醒方法', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ],
      },
      methodCollection: [
        {
          label: '在微博上 @ 我',
          value: 'weiboAt',
        },
        {
          label: '在 Twitter 上 @ 我',
          value: 'twitterAt',
        },
        {
          label: '通过我的微博账号发布微博',
          value: 'weibo',
        },
        {
          label: '通过我的 Twitter 账号发推',
          value: 'twitter',
        },
        {
          label: '邮件推送',
          value: 'email',
        },
      ],
    };
  },
  computed: {
    getTwitter() {
      return this.$store.getters.getAuth('twitter');
    },
    getWeibo() {
      return this.$store.getters.getAuth('weibo');
    },
    redirect() {
      const base = config.baseUrl +
          `login/auth?redirect=${this.$route.params.name}?subscribe=1%2526` +
          `mode=${this.$store.state.subscribe.mode}%2526` +
          `method=${this.form.method}%2526` +
          `edit=1`;
      return base;
    },
  },
  created() {
    this.form.method = this.$route.query.method || this.form.method;
    if (this.$store.state.subscribe.contact) {
      this.form.method = this.$store.state.subscribe.contact.method;
      this.form[this.form.method] = this.$store.state.subscribe.contact.address;
    } else {
      this.form[this.form.method] = this.$route.query.address;
    }


    if (this.getTwitter[0]) {
      this.form.twitter = this.getTwitter[0].id;
    }

    if (this.getWeibo[0]) {
      this.form.weibo = this.getWeibo[0].id;
    }

    this.form.email = this.$store.getters.getClient.email;

    this.save();
  },
  methods: {
    submit() {
      this.save();
      this.$emit('methodSelected');
    },
    save() {
      this.$store.commit('setSubscribeMethod', { ...this.form });
    },
    connectTwitter() {
      window.location = $.encode(config.api + 'auth/twitter?redirect=' + this.redirect);
    },
    connectWeibo() {
      window.location = $.encode(config.api + 'auth/weibo?redirect=' + this.redirect);
    },
  },
};
</script>

<style lang="scss" scoped>
  .method-container {
    display: flex;
    align-items: center;
    margin-bottom: .5rem;
  }

  .method-container span {
    width: 5rem;
    margin-right: 1rem;
    text-align: right;
  }

  .method-selector {
    width: 100%;
  }

  .show-text {
    text-align: center;
    margin-top: -1rem;
    float: none;
  }

  .submit-button-group-separate {
    margin-top: 1rem;
  }
</style>
