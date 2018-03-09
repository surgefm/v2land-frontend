<template>
  <div class="inline">
    <el-popover
      ref="pop"
      width="400"
      trigger="click"
      :disabled="!event"
    >
      <div class="event-popover">
        <span class="title" v-if="event">{{ event.name }}</span>
        <event-description v-if="event" class="description">
          {{ event.description }}
        </event-description>
        <div class="submit-button-group" v-if="event">
          <el-button
            type="primary"
            size="small"
            @click="$router.push('/' + event.name)"
          >
            前往事件
          </el-button>
        </div>
      </div>
    </el-popover>

    <div class="inline" v-popover:pop>
      <span class="event" v-if="event">{{ event.name }}</span>
      <span class="event error" v-else-if="error">该事件不存在或未被公开</span>
      <span class="event" v-else><i class="el-icon-loading" /> 事件加载中</span>
    </div>
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
    padding: .25rem .35rem;
    margin: 0 .25rem;
    cursor: pointer;
  }

  .event.error {
    background-color: $error-background;
    color: $error-color;
  }

  .event:hover {
    padding-bottom: .125rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: .125rem solid $light-color;
  }

  .event.error:hover {
    border-bottom-color: $error-color;
  }

  .event-popover {
    padding: .25rem .5rem;
  }

  .event-popover * {
    line-height: 1.5 !important;
  }

  .event-popover .title {
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 1.25;
    word-wrap: break-word;
  }

  .event-popover .description {
    margin-top: .5rem;
  }
</style>
