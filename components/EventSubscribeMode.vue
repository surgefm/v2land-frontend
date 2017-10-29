<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="90px">
      <el-form-item label="关注模式" prop="mode">
        <el-select
          v-model="form.mode"
          placeholder="请选择在什么情况下提醒你"
          class="mode-selector"
        >
          <el-option
            v-for="mode in simpleMode"
            :key="mode.value"
            :label="mode.label"
            :value="mode.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="submit-button-group">
      <el-button type="primary" @click="submit" :disabled="!form.mode">
        下一步
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          mode: ''
        },
        rules: {
          mode: [
            { required: true, message: '请选择关注模式', trigger: 'blur' }
          ]
        },
        simpleMode: [
          {
            label: '每当有新的新闻时提醒我',
            value: 'new'
          }, {
            label: '从现在起每周提醒我',
            value: 'weekly'
          }, {
            label: '每当事件有七天没有新的新闻时提醒我',
            value: '7DaysSinceLatestNews'
          }
        ]
      }
    },
    methods: {
      submit () {
        this.$store.commit('setSubscribeMode', this.form.mode)
        this.$emit('modeSelected')
      }
    },
    created () {
      this.form.mode = this.$store.state.subscribe.mode
    }
  }
</script>

<style scoped>
  .mode-container {
    display: flex;
    align-items: center;
  }

  .mode-container span {
    width: 5rem;
    margin-right: 1rem;
    text-align: right;
  }

  .mode-selector {
    width: calc(100% - 90px);
  }

  .submit-button-group {
    margin-top: 1rem;
  }
</style>
