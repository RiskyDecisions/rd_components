import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ModelTree.css';

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ isVisible: !this.state.isVisible });
  }

  render() {

    let iconSpan;
    let nodes;

    if (this.props.node.type === 'folder') {
      if (this.state.isVisible) {
        iconSpan = <span className="icon" onClick={this.handleClick}>
          <i className="far fa-folder-open"></i>
        </span>;
      } else {
        iconSpan = <span className="icon" onClick={this.handleClick}>
          <i className="far fa-folder"></i>
        </span>;
      }
    }

    if (this.props.children) {
      if (this.state.isVisible) {
        nodes = this.props.children.map(i =>
          <Node
            node={i}
            children={i.children}
            handleClick={this.props.handleClick}
            selectedNode={this.props.selectedNode} />
        );
      }
    }

    return (
      <li>
        {iconSpan}
        <span
          onClick={() => this.props.handleClick(this.props.node)}
          className={this.props.selectedNode === this.props.node.id ? 'selected' : ''}
          data-balloon-pos="below"
          data-balloon={this.props.node.description}
          data-balloon-length="large">
          {this.props.node.name}
        </span>
        {
          nodes
            ? <ul>{nodes}</ul>
            : null
        }

      </li>
    );
  }
}

Node.propTypes = {
  node: PropTypes.object,
  handleClick: PropTypes.func,
  children: PropTypes.array,
  selectedNode: PropTypes.number,
}


/**
 * ModelTree
 */
export default class ModelTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [],
    };
    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { modules } = newProps;

    // If incoming modules does not contain the selectedNode (id),
    // signal that no modules is selected.
    // This is used, for example, when a modules is being deleted.
    const selectedNodeId = this.state.selectedNode;
    if (Number.isInteger(selectedNodeId)) {
      const incomingModules = modules || [];
      const incomingModuleIds = incomingModules.map(x => x.id)
      if (!incomingModuleIds.includes(selectedNodeId)) {
        this.setState({ selectedNode: null }, () => {
          if (this.props.setProps) {
            this.props.setProps({
              selected_module: null
            })
          }
        })
      }
    }

    if (modules) {
      this.setState({ modules: this.parseTree(modules) })
    }

  }

  parseTree(modules, parent) {
    const out = []
    for (const i in modules) {
      const module = modules[i]
      if (module.parent === parent) {
        const children = this.parseTree(modules, module.id)
        if (children.length) {
          module.children = children
        }
        out.push(module)
      }
    }
    return out
  }

  onClick(module) {
    // De-select if selected
    if (this.state.selectedNode === module.id) {
      this.setState({ selectedNode: null })
      if (this.props.setProps) {
        this.props.setProps({
          selected_module: null
        });
      }
    }
    else {
      this.setState({ selectedNode: module.id })
      if (this.props.setProps) {
        this.props.setProps({
          selected_module: module
        });
      }
    }
  }

  render() {
    const nodes = this.state.modules.map((module) => {
      return (
        <Node
          key={module.id}
          node={module}
          children={module.children}
          handleClick={module => this.onClick(module)}
          selectedNode={this.state.selectedNode}
        />
      );
    });

    return (
      <div className="ModelTree">
        <ul>
          {nodes}
        </ul>
      </div>
    );
  }
}

ModelTree.defaultProps = {};

ModelTree.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id: PropTypes.string,

  /**
   * The value displayed in the input
   */
  value: PropTypes.string,

  /**
   * Modules
   */
  modules: PropTypes.array.isRequired,

  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps: PropTypes.func,
};
