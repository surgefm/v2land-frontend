<template>
  <div>
    <el-collapse :class="['formal-container', formalStackList.length || 'empty']">
      <p class="draggable-area help" v-if="!formalStackList.length">
        将下方备选进展拖动至该区域编辑事件
      </p>
      <draggable
        v-model="formalStackList"
        :options="{ group: 'stacks' }"
        class="draggable-area"
      >
        <el-collapse-item
          v-for="(stack, i) of formalStackList"
          :key="stack.id"
          :name="stack.id"
        >
          <template slot="title">
            <div class="collapse-title">
              <span>
                {{ formalStackList.length - i }}.
                {{ stack.title }} -
              </span>
              <span v-if="getTime(stack)">getTime(stack)</span>
              <span v-else>无初始日期</span>
              <el-tag
                type="warning"
                v-if="stack.status === 'pending'"
                size="mini"
                :disable-transitions="true"
              >
                待审核
              </el-tag>
              <el-tag
                v-if="i === 0"
                size="mini"
                :disable-transitions="true"
              >
                最新进展
              </el-tag>
              <el-tag
                v-else-if="i === formalStackList.length - 1"
                size="mini"
                :disable-transitions="true"
              >
                首个进展
              </el-tag>
            </div>
          </template>
          <p>{{ stack.description }}</p>
          <el-button type="text" @click="edit(stack)">编辑进展</el-button>
        </el-collapse-item>
      </draggable>
    </el-collapse>
    <h4 class="subtitle">备选进展</h4>
    <draggable
      v-model="remainingStackList"
      :options="{ group: 'stacks' }"
      class="remaining-list"
    >
      <event-stack-card
        v-for="stack of remainingStackList"
        :key="stack.id"
        :stack="stack"
        @click="edit(stack)"
      />
    </draggable>

    <el-dialog
      title="编辑进度"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      @close="finishEditing()"
    >
      <div class="sorter">修改基本信息</div>
      <event-stack-editor
        :stack="stackEdited"
        v-if="stackEdited"
        @edited="finishEditing()"
      />
      <div class="divider" />
      <div class="sorter">管理进展新闻</div>
      <event-stack-news-arrange
        :stack="stackEdited"
        v-if="stackEdited"
      />
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ElCollapse from 'element-ui/lib/collapse';
import ElCollapseItem from 'element-ui/lib/collapse-item';
import EventStackCard from '~/components/EventStack/EventStackCard.vue';
import EventStackEditor from '~/components/EventStack/EventStackEditor.vue';
import EventStackNewsArrange from '~/components/EventStack/EventStackNewsArrange.vue';

import '~/static/element/collapse.css';
import '~/static/element/collapse-item.css';

export default {
  props: {
    'event': Object,
  },
  data() {
    return {
      stackList: [],
      formalStackList: [],
      remainingStackList: [],
      dialogVisible: false,
      stackEdited: null,
    };
  },
  methods: {
    async updateStackList() {
      this.stackList = await this.$store.dispatch('fetchStackList', {
        where: {
          event: this.event.id,
        },
      });
      for (const stack of this.stackList) {
        this.$set(stack, 'enlisted', stack.status === 'admitted');
      }
      this.formalStackList = this.stackList.filter(s => s.enlisted).slice();
      this.remainingStackList = this.stackList.filter(s => !s.enlisted).slice();
    },
    edit(stack) {
      this.stackEdited = { ...stack };
      this.dialogVisible = true;
    },
    async finishEditing() {
      this.dialogVisible = false;
      this.stackEdited = null;
      await this.updateStackList();
    },
    getTime(stack) {
      if (!stack || !stack.time) return;
      const time = new Date(stack.time);
      return `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDay() }日`;
    },
  },
  async created() {
    await this.updateStackList();
  },
  components: {
    draggable,
    'el-collapse': ElCollapse,
    'el-collapse-item': ElCollapseItem,
    'event-stack-card': EventStackCard,
    'event-stack-editor': EventStackEditor,
    'event-stack-news-arrange': EventStackNewsArrange,
  },
};
</script>

<style lang="scss" scoped>
  .formal-container {
    position: relative;
    width: 100%;
    margin-top: .5rem;
  }

  .formal-container:not(.empty) {
    border-bottom: none;
  }

  .draggable-area {
    min-height: 3rem;
    width: 100%;
  }

  .draggable-area:not(.help) {
    padding-bottom: 1rem;
  }

  .draggable-area.help {
    text-align: center;
    vertical-align: middle;
    background-color: #fcfcfc;
    position: absolute;
    line-height: 3rem;
    top: 0;
    z-index: -100;
    font-size: 14px;
  }

  .collapse-title {
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .collapse-title > *:not(:last-child) {
    margin-right: .25rem;
  }

  .subtitle {
    margin-top: 1rem;
  }

  .remaining-list {
    display: flex;
    flex-wrap: wrap;
  }

  .sorter {
    width: 100%;
    text-align: left;
    margin-top: 0;
  }
</style>
