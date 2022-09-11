import { toggleMark } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import { MarkSpec, Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { setTextSelection } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';

import { ComponentView } from '../../ComponentView';
import { PMExtension } from '../../PMExtension';
import { isMarkActive } from '../../lib/queries/isMarkActive';
import { LinkMenuComponent } from './LinkMenu';

const LINK_INPUT_REGEX = /\[(.+)]\((\S+)\)/;

const isPlainURL = (link: any, parent: any, index: any, side: any) => {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) {
    return false;
  }

  const content = parent.child(index + (side < 0 ? -1 : 0));
  if (
    !content.isText ||
    content.text !== link.attrs.href ||
    content.marks[content.marks.length - 1] !== link
  ) {
    return false;
  }

  if (index === (side < 0 ? 1 : parent.childCount - 1)) {
    return true;
  }

  const next = parent.child(index + (side < 0 ? -2 : 1));

  return !link.isInSet(next.marks);
};

export class Link implements PMExtension {
  getSchema() {
    return {
      marks: {
        link: {
          attrs: {
            href: {
              default: '',
            },
          },
          inclusive: false,
          parseDOM: [
            {
              tag: 'a[href]',
              getAttrs: (dom: HTMLElement) => ({
                href: dom.getAttribute('href'),
              }),
            },
          ],
          toDOM: (node: any) => [
            'a',
            {
              ...node.attrs,
              rel: 'noopener noreferrer nofollow',
            },
            0,
          ],
          toMarkdown: {
            open(
              _state: MarkdownSerializerState,
              mark: any,
              parent: any,
              index: any,
            ) {
              return isPlainURL(mark, parent, index, 1) ? '<' : '[';
            },
            close(
              state: MarkdownSerializerState,
              mark: any,
              parent: any,
              index: any,
            ) {
              return isPlainURL(mark, parent, index, -1)
                ? '>'
                : `](${state.esc(mark.attrs.href)}${
                    mark.attrs.title ? ` ${state.quote(mark.attrs.title)}` : ''
                  })`;
            },
          },
          parseMarkdown() {
            return {
              mark: 'link',
              getAttrs: (tok: any) => ({
                href: tok.attrGet('href'),
                title: tok.attrGet('title') || null,
              }),
            };
          },
        },
      } as MarkSpec,
    };
  }

  inputRules({ schema }: { schema: Schema }) {
    const type = schema.marks.link;

    return [
      new InputRule(LINK_INPUT_REGEX, (state, match, start, end) => {
        const [okay, alt, href] = match;
        const { tr } = state;

        if (okay) {
          tr.replaceWith(start, end, schema.text(alt)).addMark(
            start,
            start + alt.length,
            type.create({ href }),
          );
        }

        return tr;
      }),
    ];
  }

  keys({ schema }: { schema: Schema }) {
    const type = schema.marks.link;

    return {
      'Mod-k': (state: EditorState, dispatch: any) => {
        toggleMark(type, { href: '' })(state, (tr) => {
          dispatch(setTextSelection(state.selection.$to.pos - 1)(tr));
        });
      },
    };
  }

  editorViews = [
    (editorView: EditorView) =>
      new ComponentView(
        LinkMenuComponent,
        editorView,
        {},
        {
          shouldRender: (view: EditorView) =>
            isMarkActive(view.state.schema.marks.link)(view.state),
        },
      ),
  ];
}
