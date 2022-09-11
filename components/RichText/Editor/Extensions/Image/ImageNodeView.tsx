import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Input, Tooltip } from 'antd';
import { BoxSpacing, HBox } from 'cerulean/src/components/Box/Box';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';
import styled from 'styled-components';
import { Key } from 'ts-key-enum';

import THEME from '../../../../../styles/variables';

interface Props {
  node: Node;
  isSelected: boolean;
  view: EditorView;
  getPos: () => number;
}

export const ImageNodeView = ({ node, isSelected, view, getPos }: Props) => {
  const { src } = node.attrs as { src: string };
  if (!src) {
    return <ImageEdit view={view} value={src} getPos={getPos} />;
  }

  return (
    <ImageWrapper isSelected={isSelected}>
      {isSelected ? (
        <ImageEdit view={view} value={src} getPos={getPos} />
      ) : null}
      <Img src={src} />
    </ImageWrapper>
  );
};

interface ImageEditProps {
  view: EditorView;
  value: string;
  getPos: () => number;
}

const ImageEdit = ({ view, value, getPos }: ImageEditProps) => {
  const [imgUrl, setImgUrl] = React.useState(value);
  const [inputEl, setInputEl] = React.useState<Input | null>(null);

  React.useEffect(() => {
    if (inputEl && !value) {
      setTimeout(() => inputEl.focus());
    }
  }, [value, inputEl]);

  const updateUrl = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const pos = getPos();
      const imageType = view.state.schema.nodes.image;
      view.dispatch(
        view.state.tr.replaceWith(
          pos,
          pos + 1,
          imageType.create({ src: imgUrl }),
        ),
      );
      view.focus();
    },
    [view, getPos, imgUrl],
  );

  const removeImg = React.useCallback(() => {
    const pos = getPos();
    view.dispatch(view.state.tr.deleteRange(pos, pos + 1));
    view.focus();
  }, [getPos, view]);

  return (
    <ImgForm onSubmit={updateUrl} contentEditable={false}>
      <img src="" alt="" />
      <Input
        placeholder="Enter image url..."
        value={imgUrl}
        onInput={(ev: React.ChangeEvent<HTMLInputElement>) =>
          setImgUrl(ev.target.value)
        }
        name="imageUrl"
        type="url"
        onKeyDown={(ev) => {
          if (ev.key === Key.Escape) {
            ev.preventDefault();
            ev.stopPropagation();
            if (!value) {
              removeImg();
            }
            view.focus();
          }
          if (ev.metaKey && ev.key === Key.Enter) {
            // Mod+Enter doesn't submit by default
            updateUrl(ev);
          }
        }}
        ref={setInputEl}
      />

      <HBox spacing={BoxSpacing.SMALL}>
        <Tooltip title="Save">
          <Button
            data-testid="confirm"
            tabIndex={-1}
            type="link"
            htmlType="submit"
            icon={<CheckOutlined />}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            data-testid="confirm"
            tabIndex={-1}
            type="link"
            onClick={removeImg}
            icon={<DeleteOutlined />}
          />
        </Tooltip>
      </HBox>
    </ImgForm>
  );
};

const Img = styled.img`
  display: inline-block;
  position: relative;
  max-width: 75% !important;
  max-height: 75vh;
`;

const ImageWrapper = styled.div<{ isSelected: boolean }>`
  line-height: 0;
  display: inline;
  background: ${({ isSelected }) =>
    isSelected ? THEME.antdDefaultBorderColor : 'none'};

  & > form {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -100%);
  }
`;

const ImgForm = styled.form`
  background: white;
  border: 1px solid ${THEME.antdDefaultBorderColor};
  border-radius: 2px;
  width: 300px;
  display: flex;

  img {
    display: none;
  }

  input {
    width: 100%;
    padding: 8px;
    border: none;
  }
  & > span {
    white-space: nowrap;
  }
  button {
    height: 100%;
  }
`;
