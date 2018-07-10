<template>
  <div>
    <div class="subscribe-container" @click="showDialog = true">
      <span class="text light-font">关注事件</span>
      <i class="icon el-icon-bell light-font" />
    </div>
    <el-dialog
      title="关注事件"
      :visible.sync="showDialog"
      :modal-append-to-body="false"
      width="20%"
    >
      <span>该功能尚未正式开放，请耐心等待。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDialog = false">
          确认
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
    };
  },
};
</script>
