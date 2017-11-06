<template>
  <div class="share">
    <div class="icon-container">
      <el-select v-model="status" class="select" @change="updateStatus">
        <el-option
          v-for="item in statusCollection"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <i class="el-icon-edit border-color" @click="edit"></i>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      event: Object
    },
    data () {
      return {
        statusCollection: [
          { value: 'admitted', label: '公开' },
          { value: 'pending', label: '待审核' },
          { value: 'hidden', label: '隐藏' }
        ],
        status: this.event.status
      }
    },
    methods: {
      updateStatus () {
        this.$store.dispatch('editEvent', {
          name: this.event.name,
          data: { status: this.status }
        }).then(() => {
          this.$emit('update')
        })
      },
      edit () {
        this.$router.push(`/${this.event.name}/edit?redirect=/admin/event`)
      }
    }
  }
</script>

<style scoped>
  .share {
    display: flex;
    justify-content: flex-end;
    font-size: 1.5rem;
    margin: .5rem 0 0 0;
  }

  .select {
    width: 7rem;
  }

  .border-color {
    padding: .4rem;
    margin: 0 0 0 .5rem;
    transition: all .2s;
    cursor: pointer;
    border: transparent .25rem solid;
    border-top: none;
    border-left: none;
    border-right: none;
    height: 2.5rem;
  }

  .icon-container {
    display: flex;
    align-items: center;
  }

  .border-color:before {
    color: rgb(129, 207, 224);
    transition: all .2s;
  }

  .border-color:hover {
    border-color: rgb(52, 152, 219);
  }

  .el-icon-edit:hover:before {
    color: #336e7b;
  }
</style>
