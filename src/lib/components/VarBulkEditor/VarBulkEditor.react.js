import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './VarBulkEditor.css';
import { METHOD_VALUE_INPUT_MAP } from '../../constants/methodValueInputMap';

/**
 * VarBulkEditor component
 */
export default class VarBulkEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variables: [],
    }
    this.handleValueInputChange = this.handleValueInputChange.bind(this);
    this.renderVarInputs = this.renderVarInputs.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.doneEditing = this.doneEditing.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const variables = newProps.data ? newProps.data.variables : null;
    // Only update component if new variables are passed
    if (variables) {
      // Create var value inputs states
      variables.map((variable, varIndex) => {
        const valList = variable.value.toString().trim().split(' ')
        valList.map((value, valIndex) => {
          variables[varIndex][`varValue${valIndex}`] = value
        });
      })
      this.setState({ variables })
    }
  }

  handleValueInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const rowIndex = target.getAttribute('data-row-index');

    const variables = [...this.state.variables];
    const currentVar = variables[rowIndex];

    // E.g. "10 15 20"
    const currentVarValue = currentVar.value;

    // E.g. [10, 15, 20]
    const currentVarValueList = currentVarValue.toString().trim().split(' ');

    // E.g. varValue0 = x
    currentVar[name] = value;

    //
    let inputIndex;
    switch (name) {
      case 'varValue0':
        inputIndex = 0;
        break;
      case 'varValue1':
        inputIndex = 1;
        break;
      case 'varValue2':
        inputIndex = 2;
        break;
      case 'varValue3':
        inputIndex = 3;
        break;
      default:
        break;
    }

    // Update the value
    currentVarValueList[inputIndex] = value
    currentVar.value = currentVarValueList.join(' ');

    // Signal we need to save it
    currentVar.editing = true;
    variables[rowIndex] = currentVar;

    this.setState({ variables });
  }

  onSubmit(event) {
    event.preventDefault();
    const formIndex = event.target.getAttribute('data-form-index');
    if (this.props.setProps && this.formIsValid()) {
      this.props.setProps({
        submit_timestamp: Date.now(),
        data: this.state.variables[formIndex]
      });
      this.doneEditing(formIndex);
    }
  }

  formIsValid() {
    return true
  }

  doneEditing(stateVaribleIndex) {
    const variables = [...this.state.variables]
    const currentVar = variables[stateVaribleIndex]
    currentVar.editing = false
    this.setState({ variables })
  }

  renderVarInputs(variable, rowIndex) {
    // Determine number of input based on its method.
    const inputs = [...METHOD_VALUE_INPUT_MAP[variable.method]];
    // If its a riskVariable we preprend a prop input
    if (variable.type === 'riskVariable') {
      inputs.unshift({ type: 'number', placeholder: 'P(X)' })
    }

    return (
      inputs.map((v, i) => {
        const name = `varValue${i}`;
        return (
          <div key={i} className="flex-even">
            <input
              data-row-index={rowIndex}
              placeholder={v.placeholder}
              type={v.type}
              name={name}
              id={name}
              onChange={this.handleValueInputChange}
              value={this.state.variables[rowIndex][`varValue${i}`]}
              className="form-control"
            />
          </div>
        )
      })
    )
  }

  renderVarRow(variable, rowIndex) {
    return (
      <form data-form-index={rowIndex} key={rowIndex} onSubmit={this.onSubmit}>
        <div className="form-row">
          <div className="col">
            <input type="text" className="form-control" placeholder="title" value={variable.title} disabled />
          </div>
          <div className="col">
            <div className="d-flex">
              {this.renderVarInputs(variable, rowIndex)}
              <div className={'VarBulkEditor__form-buttons' + (this.state.variables[rowIndex].editing ? " show" : "")}>
                <button className="btn btn-success">
                  <i className="fas fa-check"></i>
                </button>
                <button className="btn btn-danger">
                  <i className="far fa-times-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  render() {
    if (!this.state.variables) {
      return null;
    }
    return (
      <div className="VarBulkEditor">
        {this.state.variables.map((v, i) => {
          return this.renderVarRow(v, i);
        })}
      </div>
    );
  }
}

VarBulkEditor.defaultProps = {
  submit_timestamp: -1,
};

VarBulkEditor.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id: PropTypes.string,

  /**
   * ClassName
   */
  className: PropTypes.string,

  /**
   * Data
   *
   * variables: array with all project vars
   */
  data: PropTypes.shape({
    variables: PropTypes.arrayOf(
      PropTypes.shape({
        correlation: PropTypes.string,
        factor: PropTypes.string,
        id: PropTypes.string,
        method: PropTypes.string,
        module_id: PropTypes.number,
        name: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    hide: PropTypes.bool
  }),

  /**
   * An integer that represents the time (in ms since 1970)
   * at which n_clicks changed. This can be used to tell
   * which button was changed most recently.
   */
  'submit_timestamp': PropTypes.number,

  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps: PropTypes.func,

  /**
   * Defines CSS styles which will override styles previously set.
   */
  'style': PropTypes.object,

};
