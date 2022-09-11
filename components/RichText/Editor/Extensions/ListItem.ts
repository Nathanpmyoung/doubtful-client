import { MarkdownSerializerState } from 'prosemirror-markdown';
import { NodeSpec, Schema } from 'prosemirror-model';
import {
  splitListItem,
  sinkListItem,
  liftListItem,
} from 'prosemirror-schema-list';

import { PMExtension } from '../PMExtension';

export class ListItem implements PMExtension {
  getSchema() {
    return {
      nodes: {
        list_item: {
          content: 'paragraph block*',
          defining: true,
          draggable: true,
          parseDOM: [{ tag: 'li' }],
          toDOM: () => ['li', 0],

          toMarkdown(state: MarkdownSerializerState, node: any) {
            state.renderContent(node);
          },

          parseMarkdown: { block: 'list_item' },
        },
      } as NodeSpec,
    };
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.nodes.list_item;

    return {
      Enter: splitListItem(type),
      Tab: sinkListItem(type),
      'Shift-Tab': liftListItem(type),
      'Mod-]': sinkListItem(type),
      'Mod-[': liftListItem(type),
    };
  }
}
