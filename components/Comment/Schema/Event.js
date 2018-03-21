const eventSpec = {
  attrs: {
    content: { default: 0 },
    uid: { default: 0 },
  },
  inline: true,
  group: 'inline',
  draggable: true,
  isolating: true,
  selectable: true,
  contentEditable: false,
  toDOM: (node) => ['span', {
    'class': 'event-tag',
    'style': 'display: inline;',
  }],
  parseDOM: [
    { tag: 'span.event-tag' },
  ],
};

export default eventSpec;
