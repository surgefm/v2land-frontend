<script>
import Text from './ItemText.vue';
import Event from './ItemEvent.vue';
import News from './ItemNews.vue';

export default {
  props: ['type', 'content'],
  render: function(createElement) {
    return createElement(this.type + '-item', {
      props: {
        content: this.content,
      },
    });
  },
  components: {
    'text-item': Text,
    'event-item': Event,
    'news-item': News,
  },
};
</script>
