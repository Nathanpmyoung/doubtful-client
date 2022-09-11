import { InputRule } from 'prosemirror-inputrules';
import { NodeSpec, MarkSpec, Schema, Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, EditorView, NodeView } from 'prosemirror-view';

import { EditorViewView } from './lib/EditorViewView';

export class PMExtension {
  public getSchema?(): {
    nodes?: {
      [key: string]: NodeSpec;
    };
    marks?: {
      [key: string]: MarkSpec;
    };
  };

  public keys?(opts: { schema: Schema }): { [key: string]: any };

  public inputRules?(opts: { schema: Schema }): InputRule[];

  public plugin?(schema: Schema): Plugin | Plugin[];

  public nodeViews?: {
    [nodeName: string]: (
      node: Node,
      view: EditorView,
      getPos: any,
      decorations: Decoration[],
    ) => NodeView;
  };

  public editorViews?: ((view: EditorView) => EditorViewView<any>)[];
}
