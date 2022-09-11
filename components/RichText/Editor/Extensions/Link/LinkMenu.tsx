import { EditorView } from "prosemirror-view";
import React, { FormEvent, useEffect, useState } from "react";
import { Key } from "ts-key-enum";
import { setMark } from "../../lib/commands/setMark";
import { getMarkAttrs } from "../../lib/queries/getMarkAttrs";
import { getMarkRange } from "../../lib/queries/getMarkRange";

const getPosition = (view: EditorView) => {
  const { selection } = view.state;
  let el = view.domAtPos(selection.$from.pos).node;
  if (!(el as any).getBoundingClientRect) {
    el = (el as any).parentElement;
  }

  const {
    top: pTop,
    left: pLeft,
    bottom: pBottom,
    width: pWidth,
  } = view.dom.getBoundingClientRect();
  const { top, left, bottom, width, height } = (
    el as any
  ).getBoundingClientRect();

  return {
    left: left - pLeft,
    top: top - pTop,
    bottom: pBottom - bottom,
    width,
    height,
    pLeft,
    pWidth,
  };
};

export const LinkMenuComponent = ({ view }: { view: EditorView }) => {
  const { state } = view;

  const { selection } = view.state;
  const { pos } = selection.$from;
  const attr = getMarkAttrs(
    state.doc,
    { from: pos, to: pos },
    state.schema.marks.link
  );

  const [value, setValue] = useState<string>(attr.href || "");
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(!attr.href);
  const editMode = isEditing || !value;

  useEffect(() => {
    if (inputEl && editMode) {
      inputEl.focus();
    }
  }, [attr.href, inputEl]);

  const isSelecting = selection.from !== selection.to;
  if (isSelecting) {
    return null;
  }

  const { left, width, top, pWidth } = getPosition(view);
  let leftPos = left + width / 2;
  if (leftPos - 150 < 0) {
    leftPos = 150;
  }
  if (leftPos + 150 > pWidth) {
    leftPos = pWidth - 150;
  }

  const onUpdateUrl = (ev: FormEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
    let href = value;

    const hasHttpPrefix = href.match(/^https?:\/\//);
    const isHashLink = href.match(/#/);
    if (!hasHttpPrefix && !isHashLink) {
      href = `http://${href}`;
    }

    setValue(href);
    setMark(state.schema.marks.link, { href })(state, view.dispatch);
    view.focus();
    setIsEditing(false);
  };

  const removeLink = () => {
    const { schema, tr } = state;
    const range = getMarkRange(selection.$from, schema.marks.link);
    if (range) {
      const { from, to } = range;
      view.dispatch(tr.removeMark(from, to, schema.marks.link));
    }
    view.focus();
  };

  return (
    <>
      <div left={leftPos} top={top} onSubmit={onUpdateUrl}>
        {editMode ? (
          <input
            placeholder="Enter url..."
            value={value}
            onInput={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setValue(ev.target.value)
            }
            name="url"
            type="url"
            onKeyDown={(ev) => {
              if (ev.key === Key.Escape) {
                ev.preventDefault();
                ev.stopPropagation();
                removeLink();
              }
              if (ev.metaKey && ev.key === Key.Enter) {
                // Mod+Enter doesn't trigger submit
                onUpdateUrl(ev);
              }
            }}
            ref={setInputEl}
          />
        ) : (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        )}
        <div>
          {editMode ? (
              <button type='submit'>Save</button>
          ) : (
              <button
                data-testid="confirm"
                tabIndex={-1}
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  setIsEditing(true);
                }}
              >Edit</button>
          )}

            <button
              data-testid="confirm"
              tabIndex={-1}
              onClick={removeLink}
            >Delete</button>
        </div>
      </div>
    </>
  );
};

// const LinkBox = styled.form<{ left: number; top: number }>`
//   position: absolute;
//   background: white;
//   border: 1px solid ${THEME.antdDefaultBorderColor};
//   border-radius: 2px;
//   transform: translate(-50%, -100%);
//   width: 300px;
//   left: ${({ left }) => left}px;
//   top: ${({ top }) => top}px;

//   display: flex;
//   justify-content: space-between;

//   input,
//   a {
//     padding: 8px;
//     border: none;
//   }
//   input {
//     width: 100%;
//   }
//   & > span {
//     white-space: nowrap;
//   }
//   button {
//     height: 100%;
//   }
// `;
