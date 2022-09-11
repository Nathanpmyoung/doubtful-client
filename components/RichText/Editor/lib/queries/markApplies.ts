export const markApplies = (doc: any, ranges: any, type: any) => {
  for (let i = 0; i < ranges.length; i += 1) {
    const { $from, $to } = ranges[i];
    let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, (node: any) => {
      if (can) {
        return false;
      }
      can = node.inlineContent && node.type.allowsMarkType(type);

      return true;
    });
    if (can) {
      return true;
    }
  }

  return false;
};
