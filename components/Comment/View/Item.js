import Vue from 'vue';
import CommentItem from '../CommentItem.vue';

export default class ItemView {
  constructor(node, vue, getPos) {
    this.content = node.attrs.content;
    this.type = node.attrs.type || 'event';
    this.getPos = getPos;

    Vue.prototype.$store = vue.$store;
    Vue.prototype.$mockroute = vue.$route;
    Vue.prototype.$mockrouter = vue.$router;

    const ItemClass = Vue.extend(CommentItem);
    const component = new ItemClass({
      propsData: {
        content: this.content,
        type: this.type,
      },
    }).$mount();
    this.dom = document.createElement('span');
    this.dom.setAttribute('class', 'comment-item');
    this.dom.setAttribute('item-content', this.content);
    this.dom.setAttribute('item-type', this.type);
    this.dom.appendChild(component.$el);

    this.component = component;
    this.interval = setInterval(() => {
      if (this.dom.previousSibling && this.dom.previousSibling.nodeType === 3) {
        this.dom.setAttribute('style', 'margin-left: 4px');
      } else {
        this.dom.setAttribute('style', '');
      }
    }, 1000);
  }

  destroy(node) {
    clearInterval(this.interval);
    this.component.$destroy();
  }
}
