/* eslint no-magic-numbers: 0 */
import React, { Component } from 'react';

import { TreeComponent, VarEditor } from '../lib';
import { vars } from './dummyVars';

class App extends Component {

  constructor() {
    super();
    this.state = {
      value: '',
      varEditorData: {},
    };
    this.setProps = this.setProps.bind(this);
    this.addVar = this.addVar.bind(this);
  }

  setProps(newProps) {
    console.log('newProps: ', newProps);
    this.setState(newProps);
  }

  addVar() {
    this.setState({ varEditorData: { "variables": vars, moduleId: 1, timestamp: Date.now() } })
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
          data={this.state.varEditorData}
        />
        <button onClick={this.addVar}>Add var</button>
      </div>
    )
  }
}

export default App;
