<template>
<div>
  <el-form class="form" ref="form" label-width="80px">
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
  <div class="create-news">
    <el-button
      type="primary"
      size="medium"
      @click="beginNewsEditing('create')"
    >
      添加新闻
    </el-button>
  </div>

  <div class="news-list">
    <event-stack-news
      v-for="news of newsList"
      mode="edit"
      :news="news"
      :key="news.id"
      @edit="beginNewsEditing('edit')"
    />
    <div class="empty-news-list" v-if="newsList.length === 0">
      <span>未找到相关新闻</span>
    </div>
  </div>

  <el-dialog
    :title="newsEditMode === 'edit' ? '编辑新闻' : '添加新闻'"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    @close="finishNewsEditing()"
  >
    <event-news-information-form
      :mode="newsEditMode"
      :data="newsEditMode === 'edit' ? 'updateStackNews' : 'createStackNews'"
      :news="newsEditData"
      :stack="stack"
      v-on:submit="submit"
      ref="newsForm"
    />
  </el-dialog>
</div>
</template>

<script>
import EventStackNews from '~/components/EventStack/EventStackNews.vue';
import EventNewsInformationForm from '~/components/EventNews/EventNewsInformationForm.vue';
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
      newsEditMode: 'create',
      newsEditData: {},
      dialogVisible: false,
    };
  },
  methods: {
    update() {
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

      if (this.filterChange) {
        this.newsList = newsList.slice();
        this.filterChange = false;
      } else {
        const sorted = getSortedId({
          collection: this.newsList.concat(newsList),
          isDecr: false,
          returnId: false,
        });
        for (let i = sorted.length - 1; i > 0; i--) {
          if (sorted[i].id == sorted[i - 1].id) {
            sorted.splice(i, 1);
          }
        }
        this.newsList = sorted;
      }
    },
    async submit() {
      try {
        if (this.newsEditMode === 'create') {
          const data = this.$store.state.temp.createStackNews;
          const url = `event/${this.stack.event}/news`;
          await this.$axios.post(url, data);
          this.$message.success('提交成功');
        } else if (this.newsEditMode === 'edit') {
          const data = this.$store.state.temp.updateStackNews;
          await this.$store.dispatch('editNews', {
            id: data.id,
            data,
          });
          this.$message.success('修改成功');
        }
        this.finishNewsEditing();
      } catch (err) {
        console.error(err);
        this.$message.error('提交过程中发生了错误');
      } finally {
        this.$refs.newsForm.resetButton();
      }
    },
    beginNewsEditing(mode = 'create') {
      this.newsEditMode = mode;
      this.newsEditData = {};
      if (mode === 'edit') {
        this.newsEditData = { ...this.$store.state.temp.newsToEdit };
      }
      this.dialogVisible = true;
      this.$store.commit('setTemp', {
        label: 'newsToEdit',
        temp: null,
      });
    },
    finishNewsEditing() {
      this.dialogVisible = false;
      this.update();
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
    'event-news-information-form': EventNewsInformationForm,
    'el-checkbox': Checkbox,
    'el-checkbox-group': CheckboxGroup,
  },
};
</script>

<style lang="scss" scoped>
.align-center {
  line-height: 40px;
}

.create-news {
  display: flex;
  justify-content: flex-end;
}

.news-list {
  margin-top: 12px;
}

.empty-news-list {
  display: flex;
  justify-content: center;
}

.empty-news-list span {
  user-select: none;
  padding: .4rem 1rem;
  background-color: #eee;
  border-radius: .25rem;
}
</style>
