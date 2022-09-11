import { EditorView } from 'prosemirror-view';

// Naming is hard
export interface EditorViewView<T> {
  opts: T;

  dom: HTMLDivElement;

  update(view: EditorView, lastState: any): void;

  destroy(): void;
}
