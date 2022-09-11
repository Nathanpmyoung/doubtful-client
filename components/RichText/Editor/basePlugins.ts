import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { keymap } from 'prosemirror-keymap';

export const makeBasePlugins = () => {
  return [keymap(baseKeymap), dropCursor(), gapCursor()];
};
