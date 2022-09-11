import { wrappingInputRule } from 'prosemirror-inputrules';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import { NodeSpec, Schema } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';
import { toggleWrap } from '../lib/commands/toggleWrap';

export class Blockquote extends PMExtension {
  getSchema() {
    return {
      nodes: {
        blockquote: {
          content: 'block+',
          group: 'block',
          defining: true,
          parseDOM: [{ tag: 'blockquote' }],
          toDOM: () => ['blockquote', 0],
          toMarkdown(state: MarkdownSerializerState, node: any) {
            state.wrapBlock('> ', null, node, () =>
              state.renderContent(node),
            );
          },
          parseMarkdown() {
            return { block: 'blockquote' };
          },
        },
      } as NodeSpec,
    };
  }

  inputRules({ schema }: { schema: Schema }) {
    const type = schema.nodes.blockquote;

    return [wrappingInputRule(/^\s*>\s$/, type)];
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.nodes.blockquote;

    return {
      'Ctrl->': toggleWrap(type),
      'Mod-]': toggleWrap(type),
    };
  }
}
