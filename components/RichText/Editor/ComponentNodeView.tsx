import { Node } from "prosemirror-model";
import { EditorView, Decoration, NodeView } from "prosemirror-view";
import * as React from "react";
import ReactDOM from "react-dom";

interface ComponentViewProps {
  node: Node;
  view: EditorView;
  getPos: () => number;
  decorations: any[];
  // decorations: Decoration<{ [key: string]: any }>[];
}

interface ComponentProps {
  component: NodeComponent;
  node: Node;
  view: EditorView;
  isSelected: boolean;
  isEditable: boolean;
  getPos: () => number;
}

type NodeComponent = React.FC<ComponentProps>;
class ComponentHarness extends React.Component<ComponentProps> {
  state: ComponentProps;

  constructor(props: ComponentProps) {
    super(props);
    this.state = { ...props };
  }

  render() {
    return <this.props.component {...this.state} />;
  }
}

export class ComponentNodeView implements NodeView {
  component: NodeComponent;

  node: Node;

  view: EditorView;

  getPos: () => number;

  decorations: any[];
  // decorations: Decoration<{ [key: string]: any }>[];

  isSelected = false;

  dom: HTMLElement;

  reactEl?: ComponentHarness | void;

  // See https://prosemirror.net/docs/ref/#view.NodeView
  constructor(
    component: NodeComponent,
    { node, view, getPos, decorations }: ComponentViewProps
  ) {
    this.component = component;
    this.getPos = getPos;
    this.decorations = decorations;
    this.node = node;
    this.view = view;
    // this.dom = null;
    this.dom = node.isInline
      ? document.createElement("span")
      : document.createElement("div");

    this.renderElement();
  }

  renderElement() {
    if (!this.reactEl) {
      // eslint-disable-next-line react/no-render-return-value
      this.reactEl = ReactDOM.render(
        <ComponentHarness
          component={this.component}
          node={this.node}
          view={this.view}
          isSelected={this.isSelected}
          isEditable={this.view.editable}
          getPos={this.getPos}
        />,
        this.dom
      );
    } else {
      this.reactEl.setState({
        node: this.node,
        view: this.view,
        isSelected: this.isSelected,
        isEditable: this.view.editable,
        getPos: this.getPos,
      });
    }
  }

  update(node: Node) {
    if (node.type.name !== this.node.type.name) {
      return false;
    }

    this.node = node;
    this.renderElement();

    return true;
  }

  selectNode() {
    this.isSelected = true;
    this.renderElement();
  }

  deselectNode() {
    this.isSelected = false;
    this.renderElement();
  }

  stopEvent() {
    return true;
  }

  destroy() {
    if (this.dom) {
      ReactDOM.unmountComponentAtNode(this.dom);
    }
    this.dom = document.createElement("div");
  }

  ignoreMutation() {
    return true;
  }
}
