/* eslint no-magic-numbers: 0 */
import React, { Component } from 'react';

import { VarEditor, ModuleEditor, ModelTree, VarBulkEditor } from '../lib';
// import { vars } from './dummyVars';
import { modules, people } from './dummyModules';

const vars = [
  {
    "calculated_on": "",
    "correlation": "",
    "factor": "",
    "id": 501,
    "method": "function",
    "module_id": 5,
    "name": "cmp_ref",
    "title": "Reference Case (USD)",
    "type": "variable",
    "value": "ref_all"
  },
  {
    "calculated_on": "",
    "correlation": "",
    "factor": "",
    "id": 502,
    "method": "function",
    "module_id": 5,
    "name": "cmp_welltec",
    "title": "Welltec Case (USD)",
    "type": "variable",
    "value": "ophwab_all"
  },
  {
    "calculated_on": "",
    "correlation": "",
    "factor": "",
    "id": 505,
    "method": "function",
    "module_id": 5,
    "name": "dif_ref_wlt",
    "title": "Dif Reference Case - Welltec Case (Open Hole WAB)",
    "type": "variable",
    "value": "ref_all-ophwab_all"
  },
  {
    "calculated_on": "",
    "correlation": "",
    "factor": "",
    "id": 506,
    "method": "",
    "module_id": 5,
    "name": "",
    "title": "asdf",
    "type": "optionVariable",
    "value": '1,{"1":"apple","2":"banana"}'
  },
  {
    "module_id": 2,
    "id": 201,
    "correlation": "",
    "factor": "",
    "method": "pert",
    "name": "ref_d_wab",
    "title": "Welltec Elements (Rig Days)",
    "type": "riskVariable",
    "value": "0 .15 .2 .3"
  },
]


class App extends Component {

  constructor() {
    super();
    this.state = {
      value: '',
      varEditorData: {},
      varBulkEditorData: {},
      moduleEditorData: {},
      modules: []
    };
    this.setProps = this.setProps.bind(this);
    this.addVar = this.addVar.bind(this);
    this.addModule = this.addModule.bind(this);
    this.openVarBulkEditor = this.openVarBulkEditor.bind(this);
    this.openTree = this.openTree.bind(this);
  }

  setProps(newProps) {
    console.log('newProps: ', newProps);
    this.setState(newProps);
  }

  addVar() {
    this.setState({ varEditorData: { "variables": vars, moduleId: 1, timestamp: Date.now() } })
  }

  openVarBulkEditor() {
    this.setState({ varBulkEditorData: { "variables": vars } })
  }

  addModule() {
    this.setState({ moduleEditorData: { project_id: 1, id: 10, timestamp: Date.now(), nameInputDisabled: true } })
  }

  openTree() {
    this.setState({ modules: modules })
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
        <ModelTree modules={this.state.modules} />
        <button onClick={this.addVar}>Add var</button>
        <button onClick={this.openVarBulkEditor}>Open VarBulkEditor</button>
        <button onClick={this.addModule}>Add module</button>
        <button onClick={this.openTree}>ModelTree</button>
      </div>
    )
  }
}

export default App;
