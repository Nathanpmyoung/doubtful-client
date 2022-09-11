import { NodeSpec } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';

import { PMExtension } from '../PMExtension';

export class TrailingNode extends PMExtension {
  getSchema() {
    return {
      nodes: {
        trailing_node: {},
      } as NodeSpec,
    };
  }

  plugin() {
    const plugin = new PluginKey('trailing_node');
    const disabledNodes = ['paragraph', 'heading'];

    return [
      new Plugin({
        key: plugin,
        view: () => ({
          update: (view) => {
            const { state } = view;
            const insertNodeAtEnd = plugin.getState(state);

            if (!insertNodeAtEnd) {
              return;
            }

            const { doc, schema, tr } = state;
            const type = schema.nodes.paragraph;
            const transaction = tr.insert(doc.content.size, type.create());
            view.dispatch(transaction);
          },
        }),
        state: {
          init: (_, state) => {
            const lastNode = state.tr.doc.lastChild;

            return lastNode
              ? !disabledNodes.includes(lastNode.type.name)
              : false;
          },
          apply: (tr, value) => {
            if (!tr.docChanged) {
              return value;
            }

            const lastNode = tr.doc.lastChild;

            return lastNode
              ? !disabledNodes.includes(lastNode.type.name)
              : false;
          },
        },
      }),
    ];
  }
}
