import { Node, NodeSpec } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import { Decoration, EditorView } from 'prosemirror-view';
import { useCallback } from 'react';
import styled from 'styled-components';

import { ComponentNodeView } from '../../ComponentNodeView';
import { ComponentView } from '../../ComponentView';
import { PMExtension } from '../../PMExtension';

const EMOJI_SEARCH_REGEXP = /(:[a-zA-Z_]*)$/; // the text ends with a ":" followed by letters or "_" (no whitespace)

const getEmojiMatch = (selection: Selection) => {
  const position = selection.$from;
  const paragraphStart = position.before();
  const textToCursor = position.doc.textBetween(
    paragraphStart,
    position.pos,
    '\n',
    '\0',
  );

  return (textToCursor.match(EMOJI_SEARCH_REGEXP) || [])[0]; // ":search_term"
};

const EmojiOptions = styled.div`
  position: absolute;
  bottom: 100%;

  background: white;
  border: 1px solid #aaa;
  border-radius: 2px;
  padding: 5px;
`;

const emojiList = [
  { emoji: '🍺', name: 'beer' },
  { emoji: '🥃', name: 'whisky' },
  { emoji: '🍷', name: 'wine' },
];

const EmojiMenuComponent = ({ view }: { view: EditorView }) => {
  const { selection } = view.state;
  const search = getEmojiMatch(selection);

  const insertEmoji = useCallback(
    (emoji: string) => {
      const { pos } = selection.$from;
      let { tr } = view.state;
      const type = view.state.schema.nodes.emoji;
      tr = tr.insert(pos, type.create({ emoji }));
      tr = tr.insertText(
        // Remove the search text
        '',
        pos - search.length,
        pos,
      );
      view.dispatch(tr);
      view.focus(); // Re-focus the editor
    },
    [view, selection, search],
  );

  if (!search) {
    return null;
  }

  const emojiOptions = emojiList.filter(({ name }) =>
    name.includes(search.slice(1)),
  );

  return (
    <EmojiOptions>
      {emojiOptions.map(({ emoji, name }) => (
        <button key="name" onClick={() => insertEmoji(emoji)}>
          {emoji} :{name}:
        </button>
      ))}
    </EmojiOptions>
  );
};

const EmojiCont = styled.span`
  display: inline-block;
  animation: spin 4s linear infinite;
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

const EmojiNode = ({ node }: { node: Node }) => (
  <EmojiCont>{node.attrs.emoji}</EmojiCont>
);

export class Emoji extends PMExtension {
  getSchema() {
    return {
      nodes: {
        emoji: {
          group: 'inline',
          inline: true,
          atom: true,
          selectable: false,
          attrs: { emoji: true },
        } as NodeSpec,
      },
    };
  }

  editorViews = [
    (editorView: EditorView) =>
      new ComponentView(EmojiMenuComponent, editorView, {}),
  ];

  nodeViews = {
    emoji(
      node: Node,
      view: EditorView,
      getPos: any,
      decorations: Decoration[],
    ) {
      return new ComponentNodeView(EmojiNode, {
        node,
        view,
        getPos,
        decorations,
      });
    },
  };
}
