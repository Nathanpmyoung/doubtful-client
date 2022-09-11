import markdownIt from 'markdown-it';
import { MarkdownParser, MarkdownSerializer } from 'prosemirror-markdown';
import { Schema } from 'prosemirror-model';

export const makeParser = (schema: Schema) => {
  const tokens = Object.entries(schema.nodes)
    .concat(Object.entries(schema.marks) as any)
    .reduce((acc, [key, attrs]) => {
      const parse = attrs.spec.parseMarkdown;
      if (!parse) {
        return acc;
      }

      return {
        ...acc,
        [attrs.spec.markdownToken || key]:
          typeof parse === 'function' ? parse() : parse,
      };
    }, {});

  return new MarkdownParser(schema, markdownIt({ html: true }), tokens);
};

const reduceSerializer = (acc: any, [key, attrs]: any) => {
  const serialize = attrs.spec.toMarkdown || (() => ({}));

  return {
    ...acc,
    [key]: serialize,
  };
};
export const makeSerializer = (schema: Schema) => {
  const nodes = Object.entries(schema.nodes).reduce(reduceSerializer, {});
  const marks = Object.entries(schema.marks).reduce(reduceSerializer, {});

  return new MarkdownSerializer(nodes, marks);
};
