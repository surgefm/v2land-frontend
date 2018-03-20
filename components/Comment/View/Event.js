export default class EventView {
  constructor(node, vue) {
    this.dom = document.createElement('div');
    this.dom.setAttribute('style', 'display: inline-block;');
    this.event = node.attrs.content;
    this.uid = node.attrs.uid;
    vue.addItem('event', this.event, this.uid)
      .then((component) => {
        this.dom.appendChild(component.$el);
      });
  }

  update(node) {
    if (this.event !== node.attrs.content) {
      this.event = node.attrs.content;
      const component = vue.addItem('event', this.event);
      this.dom = component.$el;
    }
  }
}
