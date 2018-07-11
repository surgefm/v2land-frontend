<template>
  <div>
    <el-upload
      class="image-uploader"
      :action="config.api + 'upload'"
      :show-file-list="false"
      :with-credentials="true"
      :on-success="handleimageSuccess"
      :before-upload="beforeimageUpload"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="image"
        onload="this.id = 'show'"
      />
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

        <div class="submit-button-group" v-if="!hideButtons">
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
  </div>
</template>

<script>
  import config from '~/const';
  import $ from 'postman-url-encoder';
  import Upload from 'element-ui/lib/upload';
  import '~/static/element/upload.css';

  const url = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
  
  export default {
    data() {
      return {
        config,
        imageUrl: '',
        form: {
          imageUrl: '',
          source: '',
          sourceUrl: '',
        },
        rules: {
          imageUrl: [
            { required: true, message: '请上传图片', trigger: 'change' },
          ],
          source: [
            { required: true, message: '请输入图片来源', trigger: 'blur' },
          ],
          sourceUrl: [
            { pattern: url, message: '请输入正确的链接', trigger: 'blur' },
          ],
        },
      };
    },
    props: {
      'name': String,
      'hideButtons': Boolean,
    },
    computed: {
      event() {
        return this.$store.getters.getEvent(this.name);
      },
      orig() {
        return (this.event || {}).headerImage;
      },
      isNew() {
        return !this.orig;
      },
    },
    methods: {
      handleimageSuccess(res, file) {
        this.imageUrl = config.static + res.name;
        this.form.imageUrl = res.name;
      },
      beforeimageUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
        const isLt2M = file.size / 1024 / 1024 < 4;

        if (!isJPG) {
          this.$message.error('只支持 .jpg 或 .png 格式的图片');
        }
        if (!isLt2M) {
          this.$message.error('图片大小不得超过 4Mb');
        }
        return isJPG && isLt2M;
      },
      async submit() {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate((valid) => {
            if (valid) {
              const url = $.encode(`event/${this.name}/header_image`);
              this.$axios[this.isNew ? 'post' : 'put'](url, this.form)
                .then(() => {
                  this.$store.dispatch('fetchEvent', {
                    name: this.name,
                  });
                })
                .then(() => {
                  resolve(true);
                })
                .catch((err) => {
                  this.$message.error(err.message);
                  return resolve(false);
                });
            } else {
              resolve(false);
            }
          });
        });
      },
      reset() {
        if (this.isNew && this.$refs.form) {
          this.$refs.form.resetFields();
        } else if (!this.isNew) {
          this.imageUrl = config.static + this.orig.imageUrl;
          this.form = Object.assign({}, this.orig);
        }
      },
      async create() {
        if (!this.$store.getters.getEvent(this.name)) {
          await this.$store.dispatch('getEvent', this.name);
        }
      },
    },
    components: {
      'el-upload': Upload,
    },
    created() {
      this.reset();
    },
  };
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
