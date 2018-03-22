const itemSpec = {
  attrs: {
    content: { default: 0 },
    type: { default: 'event' },
  },
  inline: true,
  group: 'inline',
  draggable: true,
  isolating: true,
  selectable: true,
  contentEditable: false,
  toDOM: (node) => ['span', {
    'class': 'comment-item',
    'item-content': node.attrs.content,
    'item-type': node.attrs.type,
  }],
  parseDOM: [{
    tag: 'span.comment-item',
    getAttrs(dom) {
      return {
        content: dom.attributes['item-content']
          ? +dom.attributes['item-content'].value
          : -1,
        type: dom.attributes['item-type']
          ? dom.attributes['item-type'].value
          : 'event',
      };
    },
  }],
};

export default itemSpec;
