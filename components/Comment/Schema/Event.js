const eventSpec = {
  attrs: { event: { default: 0 } },
  inline: true,
  group: 'inline',
  draggable: true,
  toDOM: (node) => ['div', {
    'event-id': node.attrs.event,
    'title': node.attrs.event,
    'class': 'dinosaur',
  }, 0],
};

export default eventSpec;
