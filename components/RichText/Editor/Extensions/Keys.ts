import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Key } from 'ts-key-enum';

import { PMExtension } from '../PMExtension';

interface KeysOpts {
  onCancel?(view: EditorView): void;
  onConfirm?(view: EditorView): void;
}

export class Keys extends PMExtension {
  opts: KeysOpts;

  constructor(opts: KeysOpts) {
    super();
    this.opts = opts;
  }

  plugin() {
    return [
      new Plugin({
        props: {
          // we can't use the keys bindings for this as we want to preventDefault
          // on the original keyboard event when handled
          handleKeyDown: (view, event) => {
            if (event.key === Key.Escape && this.opts.onCancel) {
              event.preventDefault();
              event.stopPropagation();
              this.opts.onCancel(view);

              return true;
            }

            if (!event.metaKey) {
              return false;
            }
            if (event.key === 's' && this.opts.onConfirm) {
              event.preventDefault();
              event.stopPropagation();
              this.opts.onConfirm(view);

              return true;
            }

            if (event.key === Key.Enter && this.opts.onConfirm) {
              event.preventDefault();
              event.stopPropagation();
              this.opts.onConfirm(view);

              return true;
            }

            return false;
          },
        },
      }),
    ];
  }
}
