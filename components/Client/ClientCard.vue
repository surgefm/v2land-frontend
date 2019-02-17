<template>
  <div class="card-container">
    <card class="card hover">
      <div class="username-container">
        <event-title>{{ client.username }}</event-title>
        <event-title class="id">
          id: {{ client.id }}
        </event-title>
      </div>
      <p style="padding-left: 2px">
        邮箱：{{ client.email }}
      </p>
      <p>用户组：{{ role }}</p>
      <div class="action-container">
        <div class="action">
          <el-button
            plain
            @click="edit(client)"
          >
            修改信息
          </el-button>
        </div>
      </div>
    </card>
    <el-dialog
      title="修改用户信息"
      :visible.sync="showDialog"
    >
      <client-information-form
        :input="client"
        @clientUpdated="clientUpdated"
      />
    </el-dialog>
  </div>
</template>

<script>
import ClientInformationForm from '~/components/Client/ClientInformationForm.vue';

export default {
  components: {
    'client-information-form': ClientInformationForm,
  },
  props: {
    client: Object,
  },
  data() {
    return {
      showDialog: false,
    };
  },
  computed: {
    role() {
      switch (this.client.role) {
      case 'admin':
        return '社区督导员';
      case 'manager':
        return '社区管理员';
      case 'contributor':
        return '社区协作者';
      }

      return this.client.role;
    },
  },
  methods: {
    edit(client) {
      this.showDialog = true;
    },
    clientUpdated() {
      this.showDialog = false;
      this.$emit('clientUpdated');
    },
  },
};
</script>

<style lang="scss" scoped>
  .card-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .username-container {
    margin-bottom: .5rem;
  }

  .title {
    line-height: 1;
  }

  .id {
    font-size: 1rem;
    margin-left: .5rem;
    line-height: 1;
  }

  .action-container {
    width: 100%;
  }

  .action {
    display: flex;
    justify-content: flex-end;
    font-size: 1.5rem;
    margin: .5rem 0 0 0;
  }
</style>
