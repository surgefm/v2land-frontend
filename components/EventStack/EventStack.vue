<template>
  <card v-if="stack" class="stack-wrapper">
    <span
      v-if="order"
      v-clipboard="stackUrl"
      v-analytics="{
        action: 'buttonClick',
        label: 'stackOrderNumber',
        value: stack.id
      }"
      @success="copySuccess"
      class="order light-font"
    >
      {{ order }}
    </span>
    <event-stack-content
      :stack="stack"
      :mode="mode"
      :event="event"
    />
  </card>
</template>

<script>
  import config from '~/const';

  export default {
    name: 'EventStack',
    props: {
      stack: Object,
      order: Number,
      mode: String,
      event: Object,
    },
    computed: {
      stackUrl() {
        const event = this.event || this.stack.event;
        if (event.id) {
          return `${config.baseUrl}${event.id}/${event.pinyin}/${this.stack.id}`;
        }

        return `config.baseUrl${event}/${this.stack.id}`;
      },
    },
    methods: {
      copySuccess() {
        this.$message.success('已将该新闻分享链接拷贝至剪贴板');
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/variables.scss";

  .stack-wrapper {
    position: relative;
    padding: 1rem 2rem;
  }

  .order {
    font-size: 4.25rem;
    height: 4.25rem;
    line-height: 1;
    position: absolute;
    right: calc(100% - 1.25rem);
    top: 1rem;
    font-family: 'Times New Roman', Times, serif;
    cursor: pointer;
    font-weight: 900;
    transition: all .2s;
  }

  @media (max-width: 600px) {
    .order {
      position: relative;
      right: initial;
      top: 0;
      left: -.25rem;
      height: 4rem;
      float: left;
      text-shadow: none !important;
    }

    .stack-wrapper {
      padding: .75rem 1rem;
    }
  }
</style>
