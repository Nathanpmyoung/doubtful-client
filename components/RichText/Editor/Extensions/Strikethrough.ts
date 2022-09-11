import { toggleMark } from 'prosemirror-commands';
import { MarkSpec, Schema } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';
import { markInputRule } from '../lib/markInputRule';

export class Strikethrough implements PMExtension {
  getSchema() {
    return {
      marks: {
        strikethrough: {
          parseDOM: [
            {
              tag: 's',
            },
            {
              tag: 'del',
            },
            {
              tag: 'strike',
            },
          ],
          toDOM: () => ['del', 0],
          toMarkdown: {
            open: '~~',
            close: '~~',
            mixable: true,
            expelEnclosingWhitespace: true,
          },
          markdownToken: 's',
          parseMarkdown() {
            return { mark: 'strikethrough' };
          },
        },
      } as MarkSpec,
    };
  }

  inputRules({ schema }: { schema: Schema }) {
    const type = schema.marks.strikethrough;

    return [markInputRule(/~([^~]+)~$/, type)];
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.marks.strikethrough;

    return {
      'Mod-d': toggleMark(type),
    };
  }
}
