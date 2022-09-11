import { EditorState } from 'prosemirror-state';

export const isMarkActive = (type: any) => {
  return (state: EditorState): boolean => {
    const { from, $from, to, empty } = state.selection;

    return empty
      ? type.isInSet(state.storedMarks || $from.marks())
      : state.doc.rangeHasMark(from, to, type);
  };
};
