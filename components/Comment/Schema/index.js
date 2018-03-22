import { schema } from 'prosemirror-schema-basic';
import { Schema } from 'prosemirror-model';
import itemSpec from './item.js';

const editorSchema = new Schema({
  nodes: schema.spec.nodes.addToEnd('item', itemSpec),
  marks: schema.spec.marks,
});

export default editorSchema;
