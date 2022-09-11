import { NodeSpec } from 'prosemirror-model';

import { PMExtension } from '../PMExtension';

export class Doc extends PMExtension {
  getSchema() {
    return {
      nodes: {
        doc: {
          content: 'block+',
        },
      } as NodeSpec,
    };
  }
}
