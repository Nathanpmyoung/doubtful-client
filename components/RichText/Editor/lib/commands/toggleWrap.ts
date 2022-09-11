import { wrapIn, lift } from 'prosemirror-commands';

import { isNodeActive } from '../queries/isNodeActive';

export const toggleWrap = (type: any, attrs?: Record<string, any>) => {
  return (state: any, dispatch: any) => {
    const isActive = isNodeActive(type)(state);

    if (isActive) {
      return lift(state, dispatch);
    }

    return wrapIn(type, attrs)(state, dispatch);
  };
};
