import { EditorView } from "prosemirror-view";

import { BlockCode } from "./Editor/Extensions/BlockCode";
import { Blockquote } from "./Editor/Extensions/Blockquote";
import { BulletList } from "./Editor/Extensions/BulletList";
import { Doc } from "./Editor/Extensions/Doc";
import { HardBreak } from "./Editor/Extensions/HardBreak";
import { History } from "./Editor/Extensions/History";
import { InlineCode } from "./Editor/Extensions/InlineCode";
import { Italic } from "./Editor/Extensions/Italic";
import { Keys } from "./Editor/Extensions/Keys";
import { Link } from "./Editor/Extensions/Link/Link";
import { ListItem } from "./Editor/Extensions/ListItem";
import { OrderedList } from "./Editor/Extensions/OrderedList";
import { Paragraph } from "./Editor/Extensions/Paragraph";
import { Placeholder } from "./Editor/Extensions/Placeholder";
import { Strikethrough } from "./Editor/Extensions/Strikethrough";
import { Strong } from "./Editor/Extensions/Strong";
import { Text } from "./Editor/Extensions/Text";
import { TrailingNode } from "./Editor/Extensions/TrailingNode";
import { PMExtension } from "./Editor/PMExtension";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { Yjs } from "./Editor/Extensions/Yjs";

interface Props {
  yType?: Y.XmlFragment;
  awareness?: Awareness;
  placeholder?: string;
  onConfirm?(view: EditorView): void;
  onCancel?(view: EditorView): void;
}

export const makeRichTextExtensions = ({
  yType,
  awareness,
  placeholder,
  onCancel,
  onConfirm,
}: Props): PMExtension[] => {
  return [
    yType && awareness ? new Yjs(yType, awareness) : null,
    new Doc(),
    new Text(),
    new HardBreak(),
    new Paragraph(),
    new Blockquote(),
    new BulletList(),
    new BlockCode(),
    new ListItem(),
    new Strong(),
    new InlineCode(),
    new Italic(),
    new Strikethrough(),
    new Link(),
    new OrderedList(),
    new History(),
    new TrailingNode(),
    // new Image(),
    // new SlashMenu(),
    new Placeholder({ placeholder }),
    // new EmbedDemo(),
    // new Emoji(),
    new Keys({ onCancel, onConfirm }),
    // new Image(),
  ].filter((a) => a) as PMExtension[];
};
