/* eslint-disable no-cond-assign */
import { toggleMark } from 'prosemirror-commands';
import { MarkSpec, Schema } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';
import { markInputRule } from '../lib/markInputRule';

const backticksFor = (node: any, side: any) => {
  const ticks = /`+/g;
  let match: RegExpMatchArray | null;
  let len = 0;

  if (node.isText) {
    while ((match = ticks.exec(node.text))) {
      len = Math.max(len, match[0].length);
    }
  }

  let result = len > 0 && side > 0 ? ' `' : '`';
  for (let i = 0; i < len; i += 1) {
    result += '`';
  }
  if (len > 0 && side < 0) {
    result += ' ';
  }

  return result;
};

export class InlineCode extends PMExtension {
  getSchema() {
    return {
      marks: {
        code_inline: {
          excludes: '_',
          parseDOM: [{ tag: 'code' }],
          toDOM: () => ['code', { spellCheck: false }],

          toMarkdown: {
            open(_state: any, _mark: any, parent: any, index: any) {
              return backticksFor(parent.child(index), -1);
            },
            close(_state: any, _mark: any, parent: any, index: any) {
              return backticksFor(parent.child(index - 1), 1);
            },
            escape: false,
          },

          parseMarkdown() {
            return { mark: 'code_inline' };
          },
        },
      } as MarkSpec,
    };
  }

  inputRules({ schema }: { schema: Schema }) {
    const type = schema.marks.code_inline;

    return [markInputRule(/(?:^|[^`])(`([^`]+)`)$/, type)];
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.marks.code_inline;

    // Note: This key binding only works on non-Mac platforms
    // https://github.com/ProseMirror/prosemirror/issues/515
    return {
      'Mod`': toggleMark(type),
    };
  }
}
