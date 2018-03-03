<template>
  <background class="admin-client-container">
    <card>
      <event-title>管理用户</event-title>
      <el-form class="form" ref="form" label-width="120px">
        <el-form-item label="用户组">
          <el-checkbox-group v-model="filterRole" class="align-center">
            <el-checkbox label="contributor">协作者</el-checkbox>
            <el-checkbox label="manager">管理员</el-checkbox>
            <el-checkbox label="admin">督导员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input v-model="filterUsername" placeholder="搜索用户名／邮箱／ID" />
        </el-form-item>
      </el-form>
    </card>
    <client-card
      v-for="client of clientList"
      :key="client.id"
      :client="client"
      v-on:clientUpdated="update"
    />
    <page-foot class="page-foot" />
  </background>
</template>

<script>
  import Checkbox from 'element-ui/lib/checkbox';
  import CheckboxGroup from 'element-ui/lib/checkbox-group';
  import ClientCard from '~/components/Client/ClientCard.vue';

  export default {
    data() {
      return {
        clientList: [],
        filterUsername: '',
        filterRole: ['contributor', 'manager', 'admin'],
      };
    },
    methods: {
      async update() {
        const where = {};
        if (this.filterRole.length > 0) {
          where.role = this.filterRole;
        }
        if (this.filterUsername) {
          where.or = [
            { id: parseInt(this.filterUsername) > -1 ? parseInt(this.filterUsername) : -1 },
            { username: { contains: this.filterUsername } },
            { email: { contains: this.filterUsername } },
          ];
        }
        this.clientList = await this.$store.dispatch('getClientList', where);
      },
    },
    components: {
      'el-checkbox': Checkbox,
      'el-checkbox-group': CheckboxGroup,
      'client-card': ClientCard,
    },
    async asyncData({ store }) {
      return {
        clientList: await store.dispatch('getClientList'),
      };
    },
    watch: {
      filterRole: function() {
        this.update();
      },
      filterUsername: function() {
        this.update();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .admin-event-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .form {
    margin-top: .5rem;
  }

  .align-center {
    line-height: 40px;
  }
</style>
