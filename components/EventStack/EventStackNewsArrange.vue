<template>
  <div>
    <el-form class="form" ref="form" label-width="72px">
      <el-form-item label="新闻状态">
        <el-checkbox-group v-model="filterStatus" class="align-center">
          <el-checkbox
            v-for="item of status"
            :key="item.label"
            :label="item.label"
          >{{ item.text }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="搜索标题">
        <el-input v-model="filterTitle" placeholder="搜索新闻标题" />
      </el-form-item>
      <el-form-item label="搜索来源">
        <el-input v-model="filterSource" placeholder="搜索新闻来源" />
      </el-form-item>
    </el-form>
    <event-stack-news
      v-for="news of newsList"
      mode="edit"
      :key="news.id"
    />
  </div>
</template>

<script>
import EventStackNews from '~/components/EventStack/EventStackNews.vue';
import getSortedId from '~/utils/getSortedId.js';
import Checkbox from 'element-ui/lib/checkbox';
import CheckboxGroup from 'element-ui/lib/checkbox-group';
import '~/static/element/checkbox.css';
import '~/static/element/checkbox-group.css';

export default {
  props: {
    stack: Object,
  },
  data() {
    return {
      page: 1,
      newsList: [],
      filterChange: false,
      filterStatus: ['pending', 'admitted'],
      filterTitle: null,
      filterSource: null,
      updateTimer: null,
      status: [
        { label: 'pending', text: '待审核' },
        { label: 'admitted', text: '过审' },
        { label: 'rejected', text: '拒绝' },
        { label: 'removed', text: '移除' },
      ],
    };
  },
  methods: {
    async update() {
      this.filterChange = true;
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }

      this.updateTimer = setTimeout(async () => {
        await this.fetchNewsList();
      });
    },
    async fetchNewsList() {
      if (!this.stack) return;

      const where = { stack: this.stack.id };
      if (this.filterStatus.length > 0) {
        where.status = this.filterStatus;
      }
      if (this.filterTitle) {
        where.title = { contains: this.filterTitle };
      }
      if (this.filterSource) {
        where.source = { contains: this.filterSource };
      }

      const newsList = await this.$store.dispatch('getNewsList', {
        where,
        page: this.page,
      });

      if (!this.filterChange) {
        this.newsList = newsList;
      } else {
        this.filterChange = false;
        this.newsList = getSortedId({
          collection: this.newsList.concat(newsList),
          isDecr: false,
          returnId: false,
        });
      }
    },
  },
  async created() {
    this.fetchNewsList();
  },
  watch: {
    filterStatus: function() {
      this.update();
    },
    filterTitle: function() {
      this.update();
    },
    filterSource: function() {
      this.update();
    },
  },
  components: {
    'event-stack-news': EventStackNews,
    'el-checkbox': Checkbox,
    'el-checkbox-group': CheckboxGroup,
  },
};
</script>

<style lang="scss" scoped>

</style>
