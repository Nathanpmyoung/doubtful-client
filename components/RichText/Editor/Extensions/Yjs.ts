import { setBlockType } from "prosemirror-commands";
import { textblockTypeInputRule } from "prosemirror-inputrules";
import { Schema } from "prosemirror-model";
import {
  ySyncPlugin,
  yCursorPlugin,
  yUndoPlugin,
  undo,
  redo,
} from "y-prosemirror";
import { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";

import { PMExtension } from "../PMExtension";

export class Yjs extends PMExtension {
  constructor(private yType: Y.XmlFragment, private awareness: Awareness) {
    super();
  }
  
  keys() {
    return {
      "Mod-z": undo,
      "Mod-y": redo,
      "Mod-Shift-z": redo,
    };
  }

  plugin() {
    return [
      ySyncPlugin(this.yType, {}),
      yCursorPlugin(this.awareness),
      yUndoPlugin(),
    ];
  }
}
