<template>
  <div class="inline event-tag">
    <a
      v-if="event"
      :href="`/${event.id}/${event.pinyin}`"
      onclick="return false;"
      class="event"
      @click="dialogVisible = true"
    ><i class="icon-flag" /> {{ event.name }}</a>
    <span
      v-else-if="error"
      class="event error"
    >该事件不存在或未被公开</span>
    <span
      v-else
      class="event"
    ><i class="el-icon-loading" /> 事件加载中</span>

    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      class="comment-event"
    >
      <div slot="title" />
      <span
        v-if="event"
        class="title"
      >{{ event.name }}</span>
      <event-description
        v-if="event"
        class="description"
      >
        {{ event.description }}
      </event-description>
      <div
        v-if="event"
        class="submit-button-group"
      >
        <a
          :href="`/${event.id}/${event.pinyin}`"
          onclick="return false;"
        >
          <el-button
            type="primary"
            size="medium"
            @click="redirect"
          >
            前往事件
          </el-button>
        </a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EventDescription from '~/components/EventAbstract/EventAbstractDescription.vue';

export default {
  components: {
    'event-description': EventDescription,
  },
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
  compoted: {
    route() {
      return this.$mockroute || this.$route;
    },
  },
  async created() {
    await this.getEvent();
  },
  methods: {
    redirect() {
      this.dialogVisible = false;
      const router = this.$mockrouter || this.$router;
      router.push({
        name: 'event-pinyin',
        params: {
          name: this.event.id,
          pinyin: this.event.pinyin,
        },
      });
    },
    async getEvent() {
      const event = this.content;
      if (event === 0) {
        return;
      }
      this.event = await this.$store.dispatch('getEvent', event);
      if (!this.event) {
        this.error = true;
      }
      return;
    },
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
    user-select: none;
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
    font-size: 1rem;
  }

  .icon-event_available {
    position: relative;
    margin-right: .2rem;
    top: 1px;
  }
</style>
