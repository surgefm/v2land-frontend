<template>
  <background class="admin-event-container">
    <card>
      <event-title>管理事件</event-title>
      <el-form class="form" ref="form" label-width="72px">
        <el-form-item label="事件状态">
          <el-checkbox-group v-model="filterStatus" class="align-center">
            <el-checkbox label="pending">待审核</el-checkbox>
            <el-checkbox label="admitted">公开</el-checkbox>
            <el-checkbox label="rejected">拒绝</el-checkbox>
            <el-checkbox label="hidden">隐藏</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input v-model="filterName" placeholder="搜索事件名" />
        </el-form-item>
      </el-form>
    </card>
    <event-card
      v-for="event of eventCollection"
      :key="event.id"
      :event="event"
      v-on:update="update"
    />
    <page-foot class="page-foot" />
  </background>
</template>

<script>
  import Checkbox from 'element-ui/lib/checkbox';
  import CheckboxGroup from 'element-ui/lib/checkbox-group';
  import '~/static/element/checkbox.css';
  import '~/static/element/checkbox-group.css';

  export default {
    data() {
      return {
        eventCollection: [],
        filterName: '',
        filterStatus: ['pending', 'admitted'],
      };
    },
    methods: {
      async update() {
        const query = { where: {} };
        if (this.filterStatus.length > 0) {
          query.where.status = this.filterStatus;
        }
        if (this.filterName) {
          query.where.name = { contains: this.filterName };
        }
        this.eventCollection = await this.$store.dispatch('getEventList', query);
      },
    },
    components: {
      'el-checkbox': Checkbox,
      'el-checkbox-group': CheckboxGroup,
    },
    async asyncData({ store }) {
      return {
        eventCollection: await store.dispatch('getEventList', {
          where: { status: ['pending', 'admitted'] },
        }),
      };
    },
    watch: {
      filterStatus: function() {
        this.update();
      },
      filterName: function() {
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
