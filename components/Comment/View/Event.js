export default class EventView {
  constructor(node, vue) {
    this.event = node.attrs.content;
    this.uid = node.attrs.uid;
    this.component = vue.getComponent(this.uid);
    if (!this.component) return;
    this.dom = document.createElement('span');
    delete this.component.$el.__vue__;
    this.dom.appendChild(this.component.$el);
    this.dom.setAttribute('style', 'display: inline');
    this.dom.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('Text', this.uid);
    });
  }
}
