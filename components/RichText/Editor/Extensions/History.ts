import { history, undo, redo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';

import { PMExtension } from '../PMExtension';

export class History extends PMExtension {
  keys() {
    return {
      'Mod-z': undo,
      'Mod-y': redo,
      'Shift-Mod-z': redo,
      Backspace: undoInputRule,
    };
  }

  plugin() {
    return [history()];
  }
}
