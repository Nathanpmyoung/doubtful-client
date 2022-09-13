import throttle from "lodash/throttle";
import { EditorView } from "prosemirror-view";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Editor } from "./Editor/Editor";
import { makeRichTextExtensions } from "./makeRichTextExtensions";
import styles from "./styles.module.css";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { makeParser, makeSerializer } from "./markdown";
import SendIcon from "public/icons/paper-airplane.svg";

const isDescendant = (parent: Element, child: Element) => {
  if (parent === child) {
    return true;
  }
  let node = child.parentNode;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
};

interface RichTextProps {
  value?: string;
  variant?: "comment" | "editor";
  border?: "always" | "never" | "active";
  placeholder?: string;
  yType?: Y.XmlFragment;
  awareness?: Awareness;
  readOnly?: boolean;
  cancelOnBlur?: boolean;
  confirmOnBlur?: boolean;
  onInit?(view: EditorView): void;
  onConfirm?(val: string): void;
  onChange?(val: string): void;
  onCancel?(view: EditorView): void;
  onBlur?(view: EditorView, event: FocusEvent): boolean | void;
  onFocus?(view: EditorView, event: FocusEvent): boolean | void;
}

export const RichText: React.FC<RichTextProps> = ({
  yType,
  awareness,
  placeholder,
  border,
  cancelOnBlur,
  confirmOnBlur,
  onInit,
  onConfirm,
  onChange: _onChange,
  onCancel,
  onBlur,
  onFocus,
  readOnly,
  variant,
  value,
}) => {
  const editorRef = useRef<HTMLDivElement>();
  const state = useRef<string>("");
  const [view, setView] = useState<EditorView>();
  const [cursorMovedAt, setCursorMovedAt] = useState(0); // To force a toolbar re-render
  const [focused, setFocused] = useState(false);

  const extensionHandlersRef = useRef({ onConfirm, onCancel });
  useEffect(() => {
    extensionHandlersRef.current.onConfirm = onConfirm;
    extensionHandlersRef.current.onCancel = onCancel;
  }, [onCancel, onConfirm]);

  const extensions = useMemo(
    () =>
      makeRichTextExtensions({
        yType,
        awareness,
        onConfirm: () => {
          setFocused(false);
          extensionHandlersRef.current?.onConfirm?.(state.current);
        },
        onCancel: (_view: EditorView) => {
          setFocused(false);
          extensionHandlersRef.current?.onCancel?.(_view);
        },
        placeholder,
      }),
    [setFocused, placeholder]
  );

  const _onBlur = useCallback(
    (_view: EditorView, event: FocusEvent) => {
      if (focused) {
        const target = event.relatedTarget as Element;
        const isInternalEvent =
          target && isDescendant(editorRef.current as HTMLDivElement, target);
        if (!isInternalEvent) {
          setFocused(false);
          if (confirmOnBlur && onConfirm) {
            onConfirm(state.current);
          } else if (cancelOnBlur && onCancel) {
            if (view) {
              onCancel(view);
            }
          } else if (onBlur) {
            const ret = onBlur(_view, event);
            if (typeof ret === "boolean") {
              return ret;
            }
          }

          return true;
        }
      }

      return false;
    },
    [focused, setFocused]
  );

  const onChange = useCallback(
    throttle((val: string) => _onChange?.(val), 200),
    [_onChange]
  );

  return (
    <div className={styles.editorContainer}>
      <div
        className={styles.editorWrapper}
        ref={(ref: HTMLDivElement) => (editorRef.current = ref)}
      >
        <Editor<string>
          value={value}
          readOnly={readOnly}
          onInit={(_view) => {
            setView(_view);
            if (onInit) {
              onInit(_view);
            }
          }}
          onFocus={(_view, event) => {
            setFocused(true);
            if (onFocus) {
              const ret = onFocus(_view, event);
              if (typeof ret === "boolean") {
                return ret;
              }

              return true;
            }

            return false;
          }}
          onBlur={_onBlur}
          onCursorMove={() => setCursorMovedAt(Date.now())}
          onChange={(_state) => {
            state.current = _state.trim();
            onChange?.(_state.trim());
          }}
          makeParser={makeParser}
          makeSerializer={makeSerializer}
          extensions={extensions}
        />
      </div>

      {onConfirm ? (
        <button
          onClick={() => onConfirm?.(state.current)}
          className={styles.sendButton}
        >
          <SendIcon />
        </button>
      ) : null}
    </div>
  );
};
