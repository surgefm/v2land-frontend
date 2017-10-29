<template>
  <el-steps :active="step" align-center>
    <el-step title="关注模式"></el-step>
    <el-step title="提醒方法"></el-step>
    <el-step title="关注成功"></el-step>
  </el-steps>
</template>

<script>
  export default {
    props: {
      step: Number
    }
  }
</script>
