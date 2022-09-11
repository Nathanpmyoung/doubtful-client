import { MarkdownSerializerState } from 'prosemirror-markdown';
import { NodeSpec, Node, Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { Decoration, EditorView } from 'prosemirror-view';

import { ComponentNodeView } from '../../ComponentNodeView';
import { PMExtension } from '../../PMExtension';
import { ImageNodeView } from './ImageNodeView';

export class Image extends PMExtension {
  getSchema() {
    return {
      nodes: {
        image: {
          group: 'inline',
          inline: true,
          selectable: true,
          attrs: {
            src: {},
          },
          parseDOM: [
            {
              tag: 'img',
              getAttrs: (img: HTMLImageElement) => ({
                src: img.getAttribute('src'),
              }),
            },
          ],
          toDOM: (node: Node) => [
            'img',
            { ...node.attrs, contentEditable: false },
          ],
          toMarkdown(state: MarkdownSerializerState, node: Node) {
            state.write(
              `![${state.esc(
                (node.attrs.alt || '').replace('\n', '') || '',
              )}](${state.esc(node.attrs.src)})`,
            );
          },
          parseMarkdown: {
            node: 'image',
            getAttrs: (token: any) => ({
              src: token.attrGet('src'),
            }),
          },
        },
      } as NodeSpec,
    };
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.nodes.image;

    return {
      'Mod-m': (state: EditorState, dispatch: any) => {
        const { selection } = state as any;
        const position = selection.$cursor
          ? selection.$cursor.pos
          : selection.$to.pos;
        const node = type.create({ src: '' });
        const transaction = state.tr.insert(position, node);
        dispatch(transaction);

        return true;
      },
    };
  }

  nodeViews = {
    image: (
      node: Node,
      view: EditorView,
      getPos: any,
      decorations: Decoration[],
    ) =>
      new ComponentNodeView(ImageNodeView, { node, view, getPos, decorations }),
  };
}
