import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { clone } from 'ramda';

import './VarBulkEditor.css';
import { METHOD_VALUE_INPUT_MAP } from '../../constants/methodValueInputMap';

/**
 * VarBulkEditor component
 */
export default class VarBulkEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Keep variables in object so they are faster to change than in array
      variables: {},
    }
    this.doneEditing = this.doneEditing.bind(this);
    this.handleValueInputChange = this.handleValueInputChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderVarInputs = this.renderVarInputs.bind(this);
  }

  componentWillReceiveProps(newProps) {
    // Only update state when props differ
    if (newProps.data.variables !== this.props.data.variables) {
      const newVariables = [...newProps.data.variables]
      // For every variable create varInput state based on variable value
      newVariables.map((variable, varIndex) => {
        const valList = variable.value.toString().trim().split(' ')
        valList.map((value, valIndex) => {
          newVariables[varIndex][`varValue${valIndex}`] = value
        });
      })
      this.setState({ variables: newVariables })
    }
  }

  handleValueInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const varIndex = target.getAttribute('data-var-index');
    const variables = [...this.state.variables];
    const currentVar = variables[varIndex];

    // E.g. "10 15 20"
    const currentVarValue = currentVar.value;

    // Create a previous state of the variable to use it user clicks "cancel"
    // This previous state is unset again when we submit or canel
    if (!currentVar.prevState) {
      currentVar.prevState = clone(currentVar);
    }

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
    variables[varIndex] = currentVar;
    this.setState({ variables });
  }

  onSubmit(event) {
    event.preventDefault();
    const formIndex = event.target.getAttribute('data-var-index');
    if (this.props.setProps && this.formIsValid()) {
      const data = this.state.variables[formIndex];
      this.props.setProps({
        submit_timestamp: Date.now(),
        data: data
      });
      this.doneEditing(formIndex);
    }
  }

  onCancel(event) {
    event.preventDefault()
    const varIndex = event.currentTarget.getAttribute('data-var-index')
    const variables = [...this.state.variables]
    const variable = variables[varIndex]

    // // Re-set all inputs based on previous value
    // const inputs = [...METHOD_VALUE_INPUT_MAP[variable.method]];
    // // If its a riskVariable we preprend a prop input
    // if (variable.type === 'riskVariable') {
    //   inputs.unshift({ type: 'number', placeholder: 'P(X)' })
    // }

    // variable.value = variable.previousValue
    // variable.editing = false
    variables[varIndex] = variable.prevState
    delete variable.prevState;
    this.setState({ variables })
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

  renderVarInputs(variable, varIndex) {
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
              data-input-index={i}
              data-var-index={varIndex}
              placeholder={v.placeholder}
              type={v.type}
              name={name}
              id={name}
              onChange={this.handleValueInputChange}
              value={this.state.variables[varIndex][`varValue${i}`]}
              className="form-control"
              required={true}
            />
          </div>
        )
      })
    )
  }

  renderVarRow(variable, varIndex) {
    return (
      <form data-var-index={varIndex} key={varIndex} onSubmit={this.onSubmit}>
        <div className="form-row">
          <div className="col">
            <input type="text" className="form-control" placeholder="title" value={variable.title} disabled />
          </div>
          <div className="col">
            <div className="d-flex">
              {this.renderVarInputs(variable, varIndex)}
              <div className={'VarBulkEditor__form-buttons' + (this.state.variables[varIndex].editing ? " show" : "")}>
                <button className="btn btn-success">
                  <i className="fas fa-check"></i>
                </button>
                <button className="btn btn-danger" data-var-index={varIndex} onClick={this.onCancel}>
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
        {Object.keys(this.state.variables).map(varIndex => {
          return this.renderVarRow(this.state.variables[varIndex], varIndex);
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
