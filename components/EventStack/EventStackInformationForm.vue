<template>
  <div>
    <div class="select-stack">
      <el-select
        v-model="value"
        placeholder="请选择新闻所属进展"
        class="or"
        @change="$emit('input')"
      >
        <el-option
          v-for="s of stackList"
          :key="s.id"
          :label="s.title"
          :value="s.id"
        />
      </el-select>
      <span class="or">或</span>
      <el-button type="text" @click="dialogVisible = true">自定义新进展</el-button>
    </div>

    <el-dialog
      title="创建进度"
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <el-form
        ref="form"
        :model="data"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            :placeholder="latestStack.title"
            class="input name"
            v-model="data.title"
          />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            :placeholder="latestStack.description"
            v-model="data.description"
          />
        </el-form-item>
        <el-form-item label="发布时间" prop="time">
          <el-date-picker
            v-model="data.time"
            type="datetime"
            :editable="false"
            placeholder="默认为首条新闻发布时间"
          />
          <el-button type="text" @click="clearTime">
            清空时间
          </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitStack">创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DatePicker from 'element-ui/lib/date-picker';
import '~/static/element/date-picker.css';
import '~/static/element/time-picker.css';
import '~/static/element/time-select.css';

import getFormattedTime from '~/utils/getFormattedTime.js';
import isTimeValid from '~/utils/isTimeValid.js';

export default {
  name: 'EventStackInformationForm',
  props: {
    event: Number,
  },
  data() {
    return {
      value: null,
      stackList: [],
      dialogVisible: false,
      data: {
        title: null,
        description: null,
        time: null,
      },
      rules: {
        title: [
          { required: true, message: '请输入进展标题', trigger: 'blur' },
        ],
        abstract: [
          { required: true, message: '请输入进展概要', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    latestStack() {
      return this.stackList[0] || {
        title: '请输入进展标题',
        description: '请概括进展主要信息',
      };
    },
  },
  methods: {
    async submitStack() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        if (this.data.time) {
          this.data.time = getFormattedTime(this.data.time);
        }
        const { data } = await this.$axios.post(`/event/${this.event}/stack`, this.data);
        this.$store.commit('setStack', {
          stack: data.stack,
        });
        this.stackList.splice(0, 0, data.stack);

        this.value = data.stack.id;
        this.dialogVisible = false;
        this.$emit('input');
      });
    },
  },
  async created() {
    await this.$store.dispatch('getEvent', this.event);
    this.stackList = this.$store.getters.getStackCollectionByEvent({ event: this.event }) || [];
  },
  watch: {
    'data.time'(newValue, oldValue) {
      if (this.data.time) {
        if (!isTimeValid(this.data.time)) {
          this.data.time = oldValue;
          this.$message.error('进展发生时间不能晚于此刻');
        }
        this.data.time.setSeconds(0);
      }
    },
  },
  components: {
    'el-date-picker': DatePicker,
  },
};
</script>

<style lang="scss" scoped>
  .select-stack {
    display: flex;
    align-items: center;
  }

  .or {
    margin-right: .5rem;
  }

  .input.name {
    width: 15rem;
  }

  .time-picker {
    margin-right: .5rem;
  }
</style>
