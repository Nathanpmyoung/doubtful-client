import { Node, NodeSpec, Schema } from 'prosemirror-model';
import { Decoration, EditorView } from 'prosemirror-view';
import { useState } from 'react';

import { ComponentNodeView } from '../ComponentNodeView';
import { PMExtension } from '../PMExtension';
import { toggleWrap } from '../lib/commands/toggleWrap';

// interface Props {
//   node: Node;
//   isSelected: boolean;
//   isEditable: boolean;
//   getPos: () => number;
// }

const EmbedComponent = () => {
  const [number, setNumber] = useState(0);

  return (
    <div style={{ border: '1px solid pink' }}>
      <h1>Hiiii! {number}</h1>
      <button onClick={() => setNumber(number + 1)}>+1</button>
      <button onClick={() => setNumber(number - 1)}>-1</button>
    </div>
  );
};

export class EmbedDemo extends PMExtension {
  getSchema() {
    return {
      nodes: {
        embed_demo: {
          content: 'block+',
          group: 'block',
          defining: true,
          parseDOM: [{ tag: `div[data-type='embed']` }],
          toDOM: () => ['div', { 'data-type': 'embed' }, 0],
        },
      } as NodeSpec,
    };
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.nodes.embed_demo;

    return {
      'Mod-l': toggleWrap(type),
    };
  }

  nodeViews = {
    embed_demo: (
      node: Node,
      view: EditorView,
      getPos: any,
      decorations: Decoration[],
    ) =>
      new ComponentNodeView(EmbedComponent, {
        node,
        view,
        getPos,
        decorations,
      }),
  };
}
