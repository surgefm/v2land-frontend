<script>
import Text from './ItemText.vue';
import Event from './ItemEvent.vue';
import News from './ItemNews.vue';
import Link from './ItemLink.vue';

export default {
  name: 'CommentItem',
  components: {
    'text-item': Text,
    'event-item': Event,
    'news-item': News,
    'link-item': Link,
  },
  props: ['type', 'content'],
  render: function(createElement) {
    return createElement(this.type + '-item', {
      props: {
        content: this.content,
      },
    });
  },
};
</script>
