import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { RichText } from './RichText';

const textValue = `How now brown cow?`;

let onSave: any;

beforeEach(() => {
  onSave = jest.fn();
});

describe('<RichText variant="create" />', () => {
  it('renders properly', () => {
    render(<RichText defaultValue={textValue} variant="create" />);

    expect(screen.getByTestId('confirm')).toBeInTheDocument();
    expect(screen.getByText(textValue)).toBeInTheDocument();
  });

  it('submits with content', async () => {
    render(<RichText variant="create" value={textValue} onConfirm={onSave} />);

    screen.getByTestId('confirm').click();
    expect(onSave).toBeCalledWith(textValue, true);
  });

  it("doesn't submit when empty", async () => {
    render(<RichText variant="create" onConfirm={onSave} />);

    screen.getByTestId('confirm').click();
    expect(onSave).not.toBeCalledWith();
  });
});

describe("<RichText variant='update' />", () => {
  it('renders properly', () => {
    render(<RichText defaultValue={textValue} variant="update" />);

    expect(screen.getByTestId('confirm')).toBeInTheDocument();
    expect(screen.getByTestId('cancel')).toBeInTheDocument();
    expect(screen.getByText(textValue)).toBeInTheDocument();
  });
});
