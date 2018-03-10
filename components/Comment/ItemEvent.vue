<template>
  <div class="inline">
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      class="comment-event"
    >
      <div slot="title" />
      <span class="title" v-if="event">{{ event.name }}</span>
      <event-description v-if="event" class="description">
        {{ event.description }}
      </event-description>
      <div class="submit-button-group" v-if="event">
        <nuxt-link :to="'/' + event.name">
          <el-button type="primary" size="medium">
            前往事件
          </el-button>
        </nuxt-link>
      </div>
    </el-dialog>

    <span class="event" v-if="event" @click="dialogVisible = true">
      <i class="icon-event_available" />{{ event.name }}</span>
    <span class="event error" v-else-if="error">该事件不存在或未被公开</span>
    <span class="event" v-else><i class="el-icon-loading" /> 事件加载中</span>
  </div>
</template>

<script>
export default {
  props: {
    content: Number,
  },
  data() {
    return {
      event: null,
      dialogVisible: false,
      error: false,
    };
  },
  async created() {
    this.event = await this.$store.dispatch('getEvent', this.content);
    if (!this.event) {
      this.error = true;
    }
  },
};
</script>

<style lang="scss" scoped>
  @import '../../assets/variables.scss';

  .event {
    color: $light-color;
    font-size: .8rem;
    background-color: $light-background;
    border-radius: .125rem;
    padding: .25rem;
    margin: 0;
    cursor: pointer;
    padding-bottom: .1125rem;
    border-bottom: .1125rem solid transparent;
  }

  .event.error {
    background-color: $error-background;
    color: $error-color;
  }

  .event:hover {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: $light-border;
  }

  .event.error:hover {
    border-bottom-color: $error-border;
  }

  .comment-event * {
    line-height: 1.5 !important;
  }

  .comment-event .title {
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 1.25;
    word-wrap: break-word;
    color: #000;
  }

  .comment-event .description {
    margin: .5rem 0 1rem 0;
  }

  .icon-event_available {
    position: relative;
    margin-right: .2rem;
    top: 1px;
  }
</style>
