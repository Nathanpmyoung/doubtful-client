import { wrappingInputRule } from 'prosemirror-inputrules';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import { NodeSpec, Schema } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';
import { toggleList } from '../lib/commands/toggleList';

export class OrderedList extends PMExtension {
  getSchema() {
    return {
      nodes: {
        ordered_list: {
          attrs: {
            order: {
              default: 1,
            },
          },
          content: 'list_item+',
          group: 'block',
          parseDOM: [
            {
              tag: 'ol',
              getAttrs: (dom: HTMLElement) => ({
                order: dom.hasAttribute('start')
                  ? parseInt(dom.getAttribute('start') || '1', 10)
                  : 1,
              }),
            },
          ],
          toDOM: (node: any) =>
            node.attrs.order === 1
              ? ['ol', 0]
              : ['ol', { start: node.attrs.order }, 0],

          toMarkdown(state: MarkdownSerializerState, node: any) {
            const start = node.attrs.order || 1;
            const maxW = `${start + node.childCount - 1}`.length;
            const space = state.repeat(' ', maxW + 2);

            state.renderList(node, space, (i) => {
              const nStr = `${start + i}`;

              return `${state.repeat(' ', maxW - nStr.length) + nStr}. `;
            });
          },
          parseMarkdown() {
            return { block: 'ordered_list' };
          },
        },
      } as NodeSpec,
    };
  }

  inputRules({ schema }: { schema: Schema }) {
    const type = schema.nodes.ordered_list;

    return [
      wrappingInputRule(
        /^(\d+)\.\s$/,
        type,
        (match) => ({ order: +match[1] }),
        (match, node) => node.childCount + node.attrs.order === +match[1],
      ),
    ];
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.nodes.ordered_list;

    return {
      'Shift-Ctrl-9': toggleList(type, schema.nodes.list_item),
    };
  }
}
