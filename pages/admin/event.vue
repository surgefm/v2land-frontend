<template>
  <background class="admin-event-container">
    <card>
      <event-title>管理事件</event-title>
      <el-form class="form" ref="form" label-width="120px">
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
      v-for="event of filteredEvents"
      :key="event.id"
      :event="event"
      v-on:update="update"
    />
    <page-foot class="page-foot" />
    <logo class="logo" />
    <event-action />
  </background>
</template>

<script>
  export default {
    data () {
      return {
        eventCollection: [],
        filterName: '',
        filterStatus: ['pending', 'admitted']
      }
    },
    computed: {
      filteredEvents () {
        return this.eventCollection.filter(event => {
          if (''.includes && !event.name.includes(this.filterName)) {
            return false
          }
          if (!this.filterStatus.length) {
            return true
          }
          for (let status of this.filterStatus) {
            if (event.status === status) {
              return true
            }
          }
          return false
        })
      }
    },
    methods: {
      update () {
        this.$store.dispatch('getAllEventList')
          .then(eventList => {
            this.eventCollection = Array.from(eventList)
          })
      }
    },
    async asyncData ({ store }) {
      return {
        eventCollection: await store.dispatch('getAllEventList')
      }
    }
  }
</script>

<style scoped>
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
