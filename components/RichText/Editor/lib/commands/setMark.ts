import { Mark, Schema } from 'prosemirror-model';
import { EditorState, SelectionRange, Transaction } from 'prosemirror-state';

import { getMarkRange } from '../queries/getMarkRange';
import { markApplies } from '../queries/markApplies';

export function setMark<S extends Schema = any>(
  markType: Mark<S>,
  attrs?: { [key: string]: any },
) {
  return function _setMark(
    state: EditorState,
    dispatch: (tr: Transaction<S>) => void,
  ) {
    const { empty, $cursor } = state.selection as any;
    let { ranges } = state.selection;
    if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) {
      return false;
    }
    if (dispatch) {
      if ($cursor) {
        const range = getMarkRange($cursor, markType as any);
        if (range) {
          ranges = [
            {
              $from: { pos: range.from },
              $to: { pos: range.to },
            } as SelectionRange<any>,
          ];
        } else {
          return false;
        }
      }
      let has = false;
      const { tr } = state;
      for (let i = 0; !has && i < ranges.length; i += 1) {
        const { $from, $to } = ranges[i];
        has = state.doc.rangeHasMark($from.pos, $to.pos, markType as any);
      }
      for (let i = 0; i < ranges.length; i += 1) {
        const { $from, $to } = ranges[i];
        tr.addMark($from.pos, $to.pos, (markType as any).create(attrs));
      }
      dispatch(tr.scrollIntoView());
    }

    return true;
  };
}
