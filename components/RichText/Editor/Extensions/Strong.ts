import { toggleMark } from 'prosemirror-commands';
import { MarkSpec, Schema } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';
import { markInputRule } from '../lib/markInputRule';

export const StrongMarkSpec: MarkSpec = {
  parseDOM: [{ tag: 'b' }, { tag: 'strong' }, { style: 'font-style' }],
  toDOM: () => ['strong'],
  toMarkdown: {
    open: '**',
    close: '**',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  parseMarkdown() {
    return { mark: 'strong' };
  },
};

export class Strong implements PMExtension {
  getSchema() {
    return {
      marks: {
        strong: StrongMarkSpec,
      },
    };
  }

  inputRules({ schema }: { schema: Schema }) {
    const type = schema.marks.strong;

    return [markInputRule(/(?:\*\*)([^*]+)(?:\*\*)$/, type)];
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.marks.strong;

    return {
      'Mod-b': toggleMark(type),
      'Mod-B': toggleMark(type),
    };
  }
}
