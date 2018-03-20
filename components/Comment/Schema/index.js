import { schema } from 'prosemirror-schema-basic';
import { Schema } from 'prosemirror-model';
import eventSpec from './Event.js';

const editorSchema = new Schema({
  nodes: schema.spec.nodes.addToEnd('event', eventSpec),
  marks: schema.spec.marks,
});

export default editorSchema;
