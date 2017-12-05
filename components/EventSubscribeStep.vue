<template>
  <el-steps :active="step" align-center>
    <el-step title="关注模式"></el-step>
    <el-step title="提醒方法"></el-step>
    <el-step title="关注成功"></el-step>
  </el-steps>
</template>

<script>
  import Step from 'element-ui/lib/step'
  import Steps from 'element-ui/lib/steps'

  export default {
    props: {
      step: Number
    },
    components: {
      'el-step': Step,
      'el-steps': Steps
    }
  }
</script>
