export default class EventView {
  constructor(node, vue) {
    this.event = node.attrs.content;
    this.uid = node.attrs.uid;
    this.component = vue.getComponent(this.uid);

    this.dom = document.createElement('span');
    if (this.component) {
      this.dom.appendChild(this.component.$el);
    } else {
      this.uid = node.attrs.uid = vue.uid.length;
      vue.uid[this.uid] = -1;
      vue.addItem('event', this.event, this.uid)
        .then((component) => {
          if (component) {
            this.component = component;
            this.dom.appendChild(this.component.$el);
          }
        });
    }
    this.dom.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('Text', this.uid);
    });
  }
}
