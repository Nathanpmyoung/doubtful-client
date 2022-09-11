import { inputRules } from "prosemirror-inputrules";
import { keymap } from "prosemirror-keymap";
import { Schema, Node } from "prosemirror-model";
import { EditorState, Plugin, TextSelection } from "prosemirror-state";
import { DirectEditorProps, EditorView } from "prosemirror-view";
import { useEffect, useRef, useState } from "react";

import { PMExtension as Extension } from "./PMExtension";
import { makeBasePlugins } from "./basePlugins";

import styles from "./styles.module.css";

interface Parser<T> {
  parse(value: T): Node;
}
interface Serializer<T> {
  serialize(node: Node): T;
}

interface EditorProps<T> {
  extensions: Extension[];
  onInit(view: EditorView): void;
  readOnly?: boolean;
  value?: T;
  onChange?(value: T): void;
  onCursorMove?(): void;
  onFocus?(view: EditorView, event: FocusEvent): boolean;
  onBlur?(view: EditorView, event: FocusEvent): boolean;
  makeParser(schema: Schema): Parser<T>;
  makeSerializer(schema: Schema): Serializer<T>;
}

function makePlugins(extensions: Extension[]) {
  const nodeSchemas = extensions
    .map((e) => e.getSchema && e.getSchema().nodes)
    .filter((a) => a);
  const markSchemas = extensions
    .map((e) => e.getSchema && e.getSchema().marks)
    .filter((a) => a);
  const nodeViews = Object.assign(
    {},
    ...extensions.map((e) => e.nodeViews).filter((a) => a)
  );
  const editorViews = extensions
    .flatMap((e) => e.editorViews)
    .filter((a) => a)
    .map((a) => new Plugin({ view: a }));
  const schema = new Schema({
    nodes: Object.assign({}, ...nodeSchemas),
    marks: Object.assign({}, ...markSchemas),
  });
  const plugins = extensions
    .flatMap((e) => e.plugin && e.plugin(schema))
    .filter((a) => a);
  const inpRules = extensions
    .flatMap((e) => e.inputRules && e.inputRules({ schema }))
    .filter((a) => a);
  const keymaps = extensions
    .map((e) => e.keys && e.keys({ schema }))
    .filter((a) => a);

  const finalPlugins = [
    ...plugins,
    ...keymaps.map((km) => keymap(km as any)),
    ...editorViews,
    inputRules({
      rules: inpRules as any[],
    }),
    ...makeBasePlugins(),
  ];

  return { plugins: finalPlugins, schema, nodeViews };
}

export function Editor<T>({
  value,
  extensions,
  readOnly,
  onChange,
  makeParser,
  makeSerializer,
  onInit,
  onFocus,
  onBlur,
  onCursorMove,
}: EditorProps<T>) {
  const [ref, setRef] = useState<HTMLDivElement>();
  const blurRef = useRef(onBlur);
  const focusRef = useRef(onFocus);
  const schemaRef = useRef<Schema>();
  const finalPluginsRef = useRef<Plugin[]>();
  const editorRef = useRef<EditorView>();
  const parserRef = useRef<Parser<T>>();
  const serializerRef = useRef<Serializer<T>>();

  useEffect(() => {
    blurRef.current = onBlur;
    focusRef.current = onFocus;
  }, [onBlur, onFocus]);

  useEffect(() => {
    const { plugins, schema } = makePlugins(extensions);
    if (editorRef.current) {
      editorRef.current.updateState(
        EditorState.create({
          schema,
          plugins: plugins as Plugin[],
          doc: editorRef.current.state.doc,
        })
      );
    }
  }, [extensions]);

  useEffect(() => {
    if (editorRef.current && parserRef.current && value) {
      const doc = parserRef.current.parse(value);
      editorRef.current.updateState(
        EditorState.create({
          schema: editorRef.current.state.schema,
          plugins: editorRef.current.state.plugins,
          doc,
          selection: TextSelection.atEnd(doc),
        })
      );
    }

    if (value && onChange) {
      onChange(value);
    }
  }, [value]);

  const dispatchTransactionRef =
    useRef<DirectEditorProps["dispatchTransaction"]>();
  useEffect(() => {
    dispatchTransactionRef.current = (tr) => {
      if (!editorRef.current) {
        return;
      }
      const { state, transactions } =
        editorRef.current.state.applyTransaction(tr);
      editorRef.current.updateState(state);
      if (onCursorMove) {
        onCursorMove();
      }
      if (transactions.some((_tr) => _tr.docChanged) && !readOnly) {
        const val = serializerRef.current?.serialize(state.doc);
        if (onChange && val) {
          onChange(val);
        }
      }
    };
  }, [onChange, onCursorMove, readOnly]);

  useEffect(() => {
    if (ref) {
      const { plugins, schema, nodeViews } = makePlugins(extensions);
      const parser = (parserRef.current = makeParser(schema));
      serializerRef.current = makeSerializer(schema);
      schemaRef.current = schema;
      finalPluginsRef.current = plugins as Plugin[];

      const editor = new EditorView(ref, {
        nodeViews,
        attributes: {
          role: "textbox",
          "data-testid": "textbox",
          spellcheck: "false",
          translate: "no",
        },
        editable: () => !readOnly,
        dispatchTransaction: (tr) =>
          (dispatchTransactionRef as any).current?.(tr),
        handleDOMEvents: {
          focus: (view, ev) => focusRef.current?.(view, ev) as any,
          blur: (view, ev) => blurRef.current?.(view, ev) as any,
        },
        state: EditorState.create({
          schema,
          plugins: plugins as Plugin[],
        }),
      });
      editorRef.current = editor;
      if (onInit) {
        onInit(editor);
      }
    }
  }, [ref]);

  return (
    <div
      ref={(_ref: any) => setRef(_ref as HTMLDivElement)}
      className={styles.editor}
    />
  );
}
