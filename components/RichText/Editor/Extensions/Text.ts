import { NodeSpec } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';

export class Text extends PMExtension {
  getSchema() {
    return {
      nodes: {
        text: {
          group: 'inline',
          toMarkdown(state: any, node: any) {
            state.text(node.text);
          },
        },
      } as NodeSpec,
    };
  }
}
