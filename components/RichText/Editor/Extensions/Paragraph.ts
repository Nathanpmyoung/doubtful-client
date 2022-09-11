import { MarkdownSerializerState } from 'prosemirror-markdown';
import { NodeSpec } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';

export class Paragraph extends PMExtension {
  getSchema() {
    return {
      nodes: {
        paragraph: {
          content: 'inline*',
          group: 'block',
          parseDOM: [{ tag: 'p' }],
          toDOM() {
            return ['p', 0];
          },
          toMarkdown(state: MarkdownSerializerState, node: any) {
            // render empty paragraphs as hard breaks to ensure that newlines are
            // persisted between reloads (this breaks from markdown tradition)
            if (node.textContent.trim() === '' && node.childCount === 0) {
              state.write('\n');
            } else {
              state.renderInline(node);
              state.closeBlock(node);
            }
          },
          parseMarkdown() {
            return { block: 'paragraph' };
          },
        },
      } as NodeSpec,
    };
  }
}
