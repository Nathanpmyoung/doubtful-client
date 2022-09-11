import { wrappingInputRule } from 'prosemirror-inputrules';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import { NodeSpec, Schema } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';
import { toggleList } from '../lib/commands/toggleList';

export class BulletList extends PMExtension {
  getSchema() {
    return {
      nodes: {
        bullet_list: {
          content: 'list_item+',
          group: 'block',
          parseDOM: [{ tag: 'ul' }],
          toDOM: () => ['ul', 0],

          toMarkdown(state: MarkdownSerializerState, node: any) {
            state.renderList(node, '  ', () => `${node.attrs.bullet || '*'} `);
          },

          parseMarkdown() {
            return { block: 'bullet_list' };
          },
        },
      } as NodeSpec,
    };
  }

  inputRules({ schema }: { schema: Schema }) {
    const type = schema.nodes.bullet_list;

    return [wrappingInputRule(/^\s*([-+*])\s$/, type)];
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.nodes.bullet_list;

    return {
      'Shift-Ctrl-8': toggleList(type, schema.nodes.list_item),
    };
  }
}
