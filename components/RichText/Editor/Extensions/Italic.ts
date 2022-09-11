import { toggleMark } from 'prosemirror-commands';
import { MarkSpec, Schema } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';
import { markInputRule } from '../lib/markInputRule';

export class Italic implements PMExtension {
  getSchema() {
    return {
      marks: {
        italic: {
          parseDOM: [
            { tag: 'i' },
            { tag: 'em' },
            {
              style: 'font-style',
              getAttrs: (value: any) => value === 'italic',
            },
          ],
          toDOM: () => ['em'],
          toMarkdown: {
            open: '*',
            close: '*',
            mixable: true,
            expelEnclosingWhitespace: true,
          },
          markdownToken: 'em',
          parseMarkdown() {
            return { mark: 'italic' };
          },
        },
      } as MarkSpec,
    };
  }

  inputRules({ schema }: { schema: Schema }) {
    const type = schema.marks.italic;

    return [
      markInputRule(/(?:^|[^_])(_([^_]+)_)$/, type),
      markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, type),
    ];
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.marks.italic;

    return {
      'Mod-i': toggleMark(type),
      'Mod-I': toggleMark(type),
    };
  }
}
