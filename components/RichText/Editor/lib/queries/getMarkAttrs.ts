import { MarkType, Mark, Node } from 'prosemirror-model';

export const getMarkAttrs = (
  doc: Node,
  range: { from: number; to: number },
  type: MarkType,
) => {
  const { from, to } = range;
  let marks: Mark[] = [];

  doc.nodesBetween(from, to, (node) => {
    marks = [...marks, ...node.marks];
  });

  const mark = marks.find((markItem) => markItem.type.name === type.name);

  if (mark) {
    return mark.attrs;
  }

  return {};
};
