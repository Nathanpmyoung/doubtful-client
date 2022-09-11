import { MarkdownSerializerState } from 'prosemirror-markdown';
import { NodeSpec, Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

import { PMExtension } from '../PMExtension';

export class HardBreak implements PMExtension {
  getSchema() {
    return {
      nodes: {
        br: {
          inline: true,
          group: 'inline',
          selectable: false,
          parseDOM: [{ tag: 'br' }],
          toDOM() {
            return ['br'];
          },
          toMarkdown(state: MarkdownSerializerState) {
            state.write(' \n ');
          },
          markdownToken: 'hardbreak',
          parseMarkdown() {
            return { node: 'br' };
          },
        },
      } as NodeSpec,
    };
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.nodes.br;

    return {
      'Shift-Enter': (state: EditorState, dispatch: any) => {
        dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView());

        return true;
      },
    };
  }
}
