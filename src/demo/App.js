/* eslint no-magic-numbers: 0 */
import React, { Component } from 'react';

import { VarEditor, ModuleEditor, VarBulkEditor } from '../lib';
import { vars } from './dummyVars';
import { modules } from './dummyModules';

class App extends Component {

  constructor() {
    super();
    this.state = {
      value: '',
      varEditorData: {},
      varBulkEditorData: {},
      moduleEditorData: {},
    };
    this.setProps = this.setProps.bind(this);
    this.addVar = this.addVar.bind(this);
    this.addModule = this.addModule.bind(this);
    this.openVarBulkEditor = this.openVarBulkEditor.bind(this);
  }

  setProps(newProps) {
    console.log('newProps: ', newProps);
    this.setState(newProps);
  }

  addVar() {
    this.setState({ varEditorData: { "variables": vars, moduleId: 1, timestamp: Date.now() } })
  }

  openVarBulkEditor() {
    // this.setState({ varBulkEditorData: { "variables": vars } })
    this.setState({ varBulkEditorData: { "variables": [] } })
  }

  addModule() {
    this.setState({ moduleEditorData: { project_id: 1, id: 10, timestamp: Date.now(), nameInputDisabled: true } })
  }

  render() {
    return (
      <div>
        <ModuleEditor
          setProps={this.setProps}
          data={this.state.moduleEditorData}
        />
        <VarEditor
          setProps={this.setProps}
          data={this.state.varEditorData}
        />
        <VarBulkEditor
          setProps={this.setProps}
          data={this.state.varBulkEditorData}
        />
        <button onClick={this.addVar}>Add var</button>
        <button onClick={this.openVarBulkEditor}>Open VarBulkEditor</button>
        <button onClick={this.addModule}>Add module</button>
      </div>
    )
  }
}

export default App;
