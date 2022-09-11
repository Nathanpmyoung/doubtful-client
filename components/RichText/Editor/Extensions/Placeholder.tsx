import { EditorView } from 'prosemirror-view';

import { ComponentView } from '../ComponentView';
import { PMExtension } from '../PMExtension';

const PlaceholderComponent = ({
  view,
  placeholder,
}: {
  view: EditorView;
  placeholder: string;
}) => {
  const editorIsEmpty =
    view.state.doc.content.size === 0 ||
    (view.state.doc.textContent === '' && view.state.doc.content.size < 3);

  if (editorIsEmpty) {
    return (
      <p
        style={{
          position: 'absolute',
          top: 0,
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        {placeholder}
      </p>
    );
  }

  return <></>;
};

export class Placeholder extends PMExtension {
  placeholder: string;

  constructor({
    placeholder = 'Type something wonderful...',
  }: {
    placeholder?: string;
  }) {
    super();
    this.placeholder = placeholder;
  }

  editorViews = [
    (editorView: EditorView) =>
      new ComponentView(PlaceholderComponent, editorView, {
        placeholder: this.placeholder,
      }),
  ];
}
