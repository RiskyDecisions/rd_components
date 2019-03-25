import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './VarBulkEditor.css';
import { METHOD_VALUE_INPUT_MAP } from '../../constants/methodValueInputMap';

/**
 * VarBulkEditor component
 *
 * This component will be shown whenever a new timestamp
 * is passed via props data object.
 */
export default class VarBulkEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variables: [],
      updatedVariable: []
    }
    this.handleValueInputChange = this.handleValueInputChange.bind(this);
    this.renderVarInputs = this.renderVarInputs.bind(this);
  }

  componentWillReceiveProps(newProps) {
    // Show component if props.data contains new timestamp
    if (newProps.data.timestamp !== this.props.data.timestamp) {
      const { variables } = newProps.data;
      if (variables !== this.props.data.variables) {
        // this.setState({ variables: variables.slice(0, 3) })
        this.setState({ variables: variables })
      }
    }
  }

  handleValueInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const module_id = target.getAttribute('data-module_id');
    const id = target.getAttribute('data-id');
    const rowIndex = target.getAttribute('data-row-index');

    console.log('target: ', target);
    console.log('value: ', value);
    console.log('name: ', name);
    console.log('module_id: ', module_id);
    console.log('id: ', id);

    // sadf
    // this.setState(prevState => ({
    //   arrayvar: [...prevState.arrayvar, newelement]
    // }))
    // let currentVar = this.

    // this.setState({
    //   arrayvar: [...this.state.arrayvar, newelement]
    // })


    // 1. Make a shallow copy of the items
    const variables = [...this.state.variables];
    // 2. Make a shallow copy of the item you want to mutate
    const currentVar = variables[rowIndex];
    // 3. Replace the property you're intested in
    currentVar.value = '1 2 3';
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    variables[rowIndex] = currentVar;
    // 5. Set the state to our new copy
    this.setState({variables});


    // this.setState(state => {
    //   const list = state.list.map((item, j) => {
    //     if (j === i) {
    //       return item + 1;
    //     } else {
    //       return item;
    //     }
    //   });

    //   return {
    //     list,
    //   };
    // });
    // this.setState({
    //   [name]: value
    // });
  }

  renderProbabilityInput(probability) {
    return (
      <div className="flex-even">
        <input
          min="0"
          max="1"
          step=".1"
          type="number"
          name="varValueProbability"
          id="varValueProbability"
          placeholder='P(event)'
          onChange={this.handleValueInputChange}
          value={probability}
          className="form-control"
        />
      </div>
    )
  }

  // renderVarInputs(varType, varMethod, varValue) {
  renderVarInputs(variable, rowIndex) {
    // Determine number of input based on its method.
    const inputs = METHOD_VALUE_INPUT_MAP[variable.method];
    const values = variable.value.trim().split(' ');

    let probabilityInput;
    // If its a riskVariable, the first value
    // is the probability
    if (variable.type === 'riskVariable') {
      const propability = values.shift();
      probabilityInput = this.renderProbabilityInput(propability);
    }

    return (
      <div className="col">
        <div className="d-flex">
          {probabilityInput}
          {inputs.map((v, i) => {
            const name = `varValue${i}`;
            return (
              <div key={i} className="flex-even">
                <input
                  data-row-index={rowIndex}
                  // data-module_id={variable.module_id}
                  // data-id={variable.id}
                  placeholder={v.placeholder}
                  type={v.type}
                  name={name}
                  id={name}
                  onChange={this.handleValueInputChange}
                  value={values[i]}
                  className="form-control"
                />
              </div>
            )
          })
          }
        </div>
      </div>
    )
  }

  renderVarRow(variable, rowIndex) {

    const rowStyle = {
      padding: '4px',
      marginBottom: '8px',
      background: 'lightgray'
    }

    return (
      <div className="form-row" key={rowIndex} style={rowStyle}>
        <div className="col">
          <input type="text" className="form-control" placeholder="title" value={variable.title} disabled />
        </div>
        {this.renderVarInputs(variable, rowIndex)}
      </div>
    )
  }

  render() {
    if (!this.state.variables) {
      return null;
    }
    // <button>Save</button>
    return (
      <div className="VarBulkEditor">
        <form>
          {this.state.variables.map((v, i) => {
            return this.renderVarRow(v, i);
          })}
        </form>
      </div>
    );
  }
}

VarBulkEditor.defaultProps = {
  submit_timestamp: -1,
  data: {
    timestamp: 0
  }
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
   * moduleId: which module to add var to
   * variables: array with all project vars
   * timestamp: must pass a new timestamp to show the component
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
    timestamp: PropTypes.number,
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
