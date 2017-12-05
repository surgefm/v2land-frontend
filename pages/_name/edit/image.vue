<template>
  <background>
    <card>
      <p class="tag light-font">{{ $route.params.name }}</p>
      <event-title>修改事件题图</event-title>
      <el-upload
        class="image-uploader"
        :action="config.api + 'upload'"
        :show-file-list="false"
        :on-success="handleimageSuccess"
        :before-upload="beforeimageUpload">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="image"
          onload="this.id = 'show'"
        >
        <i v-else class="el-icon-plus image-uploader-icon" />
      </el-upload>
      <div class="form-container">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="80px"
          class="form"
        >
          <el-form-item label="图片来源" prop="source">
            <el-input v-model="form.source" placeholder="如新京报、人民日报等" />
          </el-form-item>
          <el-form-item label="来源链接" prop="sourceUrl">
            <el-input v-model="form.sourceUrl" placeholder="（选填）" />
          </el-form-item>

          <div class="submit-button-group">
            <el-button type="text" @click="reset">重置表单</el-button>
            <el-button
              type="primary"
              @click="submit"
              :disabled="!form.imageUrl"
            >
              提交
            </el-button>
          </div>
        </el-form>
      </div>
    </card>
    <event-action />
    <logo class="logo" />
    <page-foot/>
  </background>
</template>

<script>
  import config from '~/const'
  import $ from 'postman-url-encoder'
  import axios from '~/plugins/axios'
  import Upload from 'element-ui/lib/upload'

  let url = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
  
  export default {
    data () {
      return {
        config,
        imageUrl: '',
        form: {
          imageUrl: '',
          source: '',
          sourceUrl: ''
        },
        rules: {
          imageUrl: [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],
          source: [
            { required: true, message: '请输入图片来源', trigger: 'blur' }
          ],
          sourceUrl: [
            { pattern: url, message: '请输入正确的链接', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      orig () {
        return this.$store.getters.getEvent(this.$route.params.name).image
      },
      isNew () {
        return !this.orig
      }
    },
    methods: {
      handleimageSuccess (res, file) {
        this.imageUrl = config.static + res.name
        this.form.imageUrl = res.name
      },
      beforeimageUpload (file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
        const isLt2M = file.size / 1024 / 1024 < 4

        if (!isJPG) {
          this.$message.error('image picture must be .jpg/.png format!')
        }
        if (!isLt2M) {
          this.$message.error('image picture size can not exceed 4MB!')
        }
        return isJPG && isLt2M
      },
      submit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let url = $.encode(`events/${this.$route.params.name}/image`)
            axios[this.isNew ? 'post' : 'patch'](url, this.form)
              .then(() => {
                this.$store.dispatch('fetchEvent', this.$route.params.name)
              })
              .then(() => {
                this.$message.success('设置成功')
              })
              .catch(err => {
                this.$message.error(err.message)
              })
          }
        })
      },
      reset () {
        if (this.isNew && this.$refs.form) {
          this.$refs.form.resetFields()
        } else if (!this.isNew) {
          this.imageUrl = config.static + this.orig.imageUrl
          this.form = Object.assign({}, this.orig)
        }
      }
    },
    components: {
      'el-upload': Upload
    },
    beforeRouteEnter: (to, from, next) => {
      next(vm => {
        if (!vm.$store.getters.isClientAdmin) {
          vm.$message.error('你无权访问该页面')
          vm.$router.push('/' + vm.$route.params.name)
        }
      })
    },
    async asyncData ({ route, store }) {
      return store.dispatch('getEvent', route.params.name)
    },
    created () {
      this.reset()
    }
  }
</script>

<style lang="scss" scoped>
  .tag {
    font-size: .9rem;
    margin-right: .5rem;
  }

  .event-form,
  .image-uploader {
    margin-top: 1rem;
  }

  .image-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .image {
    width: 100%;
    height: 178px;
    display: block;
    object-fit: cover;
  }
</style>
