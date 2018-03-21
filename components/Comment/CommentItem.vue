<script>
import Event from './ItemEvent.vue';
import News from './ItemNews.vue';
import Link from './ItemLink.vue';

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
    'event-item': Event,
    'news-item': News,
    'link-item': Link,
  },
};
</script>
