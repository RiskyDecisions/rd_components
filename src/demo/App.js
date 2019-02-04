/* eslint no-magic-numbers: 0 */
import React, { Component } from 'react';

import { TreeComponent, VarEditor } from '../lib';


class App extends Component {

  constructor() {
    super();
    this.state = {
      value: '',
      showVarEditor: false,
    };
    this.setProps = this.setProps.bind(this);
    this.addVar = this.addVar.bind(this);
  }

  setProps(newProps) {
    this.setState(newProps);
  }

  addVar() {
    this.setState({ showVarEditor: !this.state.showVarEditor })
  }

  render() {
    return (
      <div>
        <TreeComponent
          setProps={this.setProps}
          {...this.state}
          label='hej'
        />
        <VarEditor
          setProps={this.setProps}
          show={this.state.showVarEditor}
        />
        <button onClick={this.addVar}>Add var</button>
      </div>
    )
  }
}

export default App;
