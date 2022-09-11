import { MarkdownSerializerState } from 'prosemirror-markdown';
import { NodeSpec } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';

export class HorizontalRule implements PMExtension {
  getSchema(): {
    nodes?: {
      [key: string]: NodeSpec;
    };
  } {
    return {
      nodes: {
        hr: {
          inline: false,
          group: 'block',
          selectable: false,
          parseDOM: [{ tag: 'hr' }],
          toDOM() {
            return ['hr'];
          },
          toMarkdown(state: MarkdownSerializerState) {
            state.write(' ---\n');
          },
          parseMarkdown() {
            return { node: 'hr' };
          },
        },
      } as NodeSpec,
    };
  }
}
