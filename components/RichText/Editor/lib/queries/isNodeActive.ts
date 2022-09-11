import { EditorState } from 'prosemirror-state';
import { findParentNode, findSelectedNodeOfType } from 'prosemirror-utils';

export const isNodeActive = (type: any, attrs: Record<string, any> = {}) => {
  return (state: EditorState) => {
    const node =
      findSelectedNodeOfType(type)(state.selection) ||
      findParentNode((n) => n.type === type)(state.selection);

    if (!Object.keys(attrs).length || !node) {
      return !!node;
    }

    return node.node.hasMarkup(type, { ...node.node.attrs, ...attrs });
  };
};
