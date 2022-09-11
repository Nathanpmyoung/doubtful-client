import { setBlockType } from 'prosemirror-commands';
import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import { NodeSpec, Schema } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';

export class BlockCode extends PMExtension {
  getSchema() {
    return {
      nodes: {
        code_block: {
          content: 'text*',
          marks: '',
          group: 'block',
          code: true,
          defining: true,
          draggable: false,
          parseDOM: [
            { tag: 'pre', preserveWhitespace: 'full' },
            {
              tag: '.code-block',
              preserveWhitespace: 'full',
              contentElement: 'code',
            },
          ],
          toDOM: () => [
            'div',
            { class: 'code-block' },
            ['pre', ['code', { spellCheck: false }, 0]],
          ],

          toMarkdown(state: MarkdownSerializerState, node: any) {
            state.write('```\n');
            state.text(node.textContent, false);
            state.ensureNewLine();
            state.write('```');
            state.closeBlock(node);
          },
          markdownToken: 'fence',
          parseMarkdown() {
            return {
              block: 'code_block',
            };
          },
        },
      } as NodeSpec,
    };
  }

  inputRules({ schema }: { schema: Schema }) {
    const type = schema.nodes.code_block;

    return [textblockTypeInputRule(/^```$/, type)];
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.nodes.code_block;

    return {
      'Shift-Ctrl-\\': setBlockType(type),
    };
  }
}
