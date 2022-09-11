import { EditorView } from 'prosemirror-view';
import * as React from 'react';
import ReactDOM from 'react-dom';

import { EditorViewView } from './lib/EditorViewView';

type ComponentViewComponent<T> = React.FC<T & { view: EditorView }>;

interface ComponentProps {
  component: ComponentViewComponent<any>;
  view: EditorView;
  harnessOpts?: HarnessOpts;
}
class ComponentHarness extends React.Component<ComponentProps> {
  state: ComponentProps;

  constructor(props: ComponentProps) {
    super(props);
    this.state = { ...props };
  }

  render() {
    if (this.state.harnessOpts && this.state.harnessOpts.shouldRender) {
      if (!this.state.harnessOpts.shouldRender(this.state.view)) {
        return <></>;
      }
    }

    return <this.state.component {...this.state} />;
  }
}

interface HarnessOpts {
  shouldRender?(view: EditorView): boolean;
}

export class ComponentView<T> implements EditorViewView<T> {
  readonly dom: HTMLDivElement;

  readonly component: ComponentViewComponent<T>;

  readonly opts: T;

  readonly harnessOpts?: HarnessOpts;

  reactEl?: ComponentHarness;

  constructor(
    component: ComponentViewComponent<T>,
    view: EditorView,
    opts: T,
    harnessOpts?: HarnessOpts,
  ) {
    this.opts = opts;
    this.harnessOpts = harnessOpts;
    this.component = component;
    this.dom = document.createElement('div');
    if (view.dom.parentNode) {
      view.dom.parentNode.appendChild(this.dom);
      this.update(view, null);
    }
  }

  update(view: EditorView, lastState: any) {
    const { state } = view;

    if (
      lastState &&
      lastState.doc.eq(state.doc) &&
      lastState.selection.eq(state.selection)
    ) {
      return;
    }

    if (this.reactEl) {
      this.reactEl.setState({
        component: this.component,
        view,
        ...this.opts,
        harnessOpts: this.harnessOpts,
      });
    } else {
      this.reactEl = ReactDOM.render(
        <ComponentHarness
          component={this.component}
          view={view}
          {...this.opts}
          harnessOpts={this.harnessOpts}
        />,
        this.dom,
      ) as any;
    }
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.dom);
  }
}
