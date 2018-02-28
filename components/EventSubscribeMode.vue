<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="4.5rem">
    <el-form-item label="关注模式" prop="mode">
      <el-select
        v-model="form.mode"
        placeholder="请选择在什么情况下提醒你"
        class="mode-selector"
        @change="submit"
      >
        <el-option
          v-for="mode in simpleMode"
          :key="mode.value"
          :label="mode.label"
          :value="mode.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          mode: '7DaysSinceLatestNews'
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
      this.form.mode = this.$store.state.subscribe.mode || this.form.mode
      this.submit()
    }
  }
</script>

<style lang="scss" scoped>
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
    width: 100%;
  }

  .submit-button-group {
    margin-top: 1rem;
  }
</style>
