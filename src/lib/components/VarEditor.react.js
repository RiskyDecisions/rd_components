import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { any, anyPass, omit, pick, propEq, propIs, values } from 'ramda';

import { TYPE_METHOD_MAP } from "../constants";

/**
 * VarEditor component
 */
export default class VarEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correlate: false,
      correlateDropdownIsOpen: false,
      correlatedTo: '',
      correlationFactor: '',
      formIsValid: false,
      varMethod: '',
      varMethodDropdownIsOpen: false,
      varName: '',
      varType: '',
      varTypeDropdownIsOpen: false,
      varValueFunction: '',
      varValueHigh: '',
      varValueLow: '',
      varValueMid: '',
      varId: '',
      VarModuleId: '',
    };

    this.close = this.close.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleValueInputChange = this.handleValueInputChange.bind(this);
    this.renderCorrelate = this.renderCorrelate.bind(this);
    this.renderMethodDropdown = this.renderMethodDropdown.bind(this);
    this.renderNameInput = this.renderNameInput.bind(this);
    this.renderTypeDropdown = this.renderTypeDropdown.bind(this);
    this.submit = this.submit.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentWillReceiveProps(newProps) {
    console.log('newProps: ', newProps);
    this.setState({ show: true });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleValueInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value }, () => {
      const { varValueLow, varValueMid, varValueHigh, varValueFunction, varType } = this.state;
      if (varType !== 'function ') {
        this.setState({ varValue: `${varValueLow} ${varValueMid} ${varValueHigh}` })
      } else {
        this.setState({ varValue: `${varValueFunction}` })
      }
    });
  }

  submit() {
    const varData = {
      name: this.state.varName,
      type: this.state.varType,
      method: this.state.varMethod,
      value: this.getVarValue(),
      correlatedTo: this.state.correlatedTo,
      correlationFactor: this.state.correlationFactor,
    }
    if (this.props.setProps && this.formIsValid()) {
      this.props.setProps({
        n_clicks_timestamp: Date.now(),
        data: varData
      });
    }
  }

  close() {
    this.setState({ show: false });
  }

  getVarValue() {
    if (this.state.varType === 'function') {
      return this.state.varValueFunction
    }
    return this.state.varValueLow + ' ' + this.state.varValueMid + ' ' + this.state.varValueHigh;
  }

  formIsValid() {

    let isValid = true;

    const varsToVerify = [
      'varMethod',
      'varName',
      'varType',
      'varValue',
      // 'varValueFunction',
      // 'varValueHigh',
      // 'varValueLow',
      // 'varValueMid',
    ]
    const vars = pick(varsToVerify, this.state)

    for (const i in vars) {
      const val = vars[i];
      if (val === '') {
        isValid = false;
      }
    }
    return isValid;
  }

  toggle(attr) {
    this.setState({
      [attr]: !this.state[attr]
    });
  }

  renderNameInput() {
    return (
      <div className="form-group">
        <label htmlFor="varName">Name</label>
        <input
          autoFocus
          type="string"
          name="varName"
          id="varName"
          placeholder="Name of variable"
          onChange={this.handleInputChange}
          value={this.state.varName}
          className="form-control"
        />
      </div>
    )
  }

  renderTypeDropdown() {
    return (
      <div className="form-group">
        <label htmlFor="varType">Type</label>
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary btn-block"
            type="button"
            onClick={() => this.toggle('varTypeDropdownIsOpen')}
          >
            {this.state.varType || "(Choose variable type)"}
          </button>
          <div
            className="dropdown-menu w-100"
            style={{ 'display': this.state.varTypeDropdownIsOpen ? 'block' : 'none' }}
          >
            <a className="dropdown-item" href="#" onClick={() => this.handleTypeClick('variable')}>Variable</a>
            <a className="dropdown-item" href="#" onClick={() => this.handleTypeClick('timeseries')}>Timeseries</a>
          </div>
        </div>
      </div>
    )
  }

  handleMethodClick(methodVal) {
    this.setState({
      varMethod: methodVal,
      varMethodDropdownIsOpen: false,
    })
  }

  handleTypeClick(typeVal) {
    this.setState({
      varType: typeVal,
      varTypeDropdownIsOpen: false,
      varMethod: '',
    })
  }

  handleCorrelateClick(moduleId, id, varName) {
    this.setState({
      correlatedTo: { module_id: moduleId, id: id, name: varName },
      correlateDropdownIsOpen: false,
    })
  }

  renderMethodDropdown() {
    return (
      <div className="form-group">
        <label htmlFor="varMethod">Method</label>
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary btn-block"
            type="button"
            onClick={() => this.toggle('varMethodDropdownIsOpen')}
          >
            {this.state.varMethod || "(Choose variable method)"}
          </button>
          {this.state.varType ?
            <div
              className="dropdown-menu w-100"
              style={{ 'display': this.state.varMethodDropdownIsOpen ? 'block' : 'none' }}
            >
              {
                Object.keys(TYPE_METHOD_MAP[this.state.varType]).map((group) => {
                  return (
                    <div key={group}>
                      <div className="dropdown-divider"></div>
                      <h6 className="dropdown-header">{group}</h6>
                      {
                        TYPE_METHOD_MAP[this.state.varType][group].map((method, index) => {
                          return (
                            <a key={group + index}
                              className="dropdown-item"
                              href="#"
                              onClick={() => this.handleMethodClick(method.value)}
                            >
                              {method.name}
                            </a>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
            : null
          }
        </div>
      </div>
    )
  }

  renderValueInput() {
    if (this.state.varMethod === 'function') {
      return (
        <div className="form-group">
          <label htmlFor="varValueFunction">Value</label>
          <input
            type="string"
            name="varValueFunction"
            id="varValueFunction"
            placeholder="Function Expression"
            onChange={this.handleValueInputChange}
            value={this.state.varValueFunction}
            className="form-control"
            disabled={this.state.varMethod ? false : true}
          />
        </div>
      )
    }
    return (
      <div className="form-group">
        <label>Value</label>
        <div className="form-row">
          <div className="col-sm-4">
            <input
              placeholder="Low"
              type="number"
              name="varValueLow"
              id="varValueLow"
              onChange={this.handleValueInputChange}
              value={this.state.varValueLow}
              className="form-control"
              disabled={this.state.varMethod ? false : true}
            />
          </div>
          <div className="col-sm-4">
            <input
              placeholder="Mid"
              type="number"
              name="varValueMid"
              id="varValueMid"
              onChange={this.handleValueInputChange}
              value={this.state.varValueMid}
              className="form-control"
              disabled={this.state.varMethod ? false : true}
            />
          </div>
          <div className="col-sm-4">
            <input
              placeholder="High"
              type="number"
              name="varValueHigh"
              id="varValueHigh"
              onChange={this.handleValueInputChange}
              value={this.state.varValueHigh}
              className="form-control"
              disabled={this.state.varMethod ? false : true}
            />
          </div>
        </div>
      </div>
    )
  }

  renderCorrelate() {
    return (
      <div className="form-group">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            name="correlate"
            onChange={this.handleInputChange}
            value={this.state.correlate}
            id="correlate"
          />
          <label className="custom-control-label" htmlFor="correlate">Correlate this variable</label>
        </div>

        {this.state.correlate ?
          <div className="form-row">
            <div className="col-md-8">
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary btn-block"
                  type="button"
                  onClick={() => this.toggle('correlateDropdownIsOpen')}
                >
                  {this.state.correlatedTo.name || "(Choose variable to correlate with)"}
                </button>
                <div
                  className="dropdown-menu w-100"
                  style={{ 'display': this.state.correlateDropdownIsOpen ? 'block' : 'none' }}
                >
                  {this.props.data.variables.map(variable => {
                    return (
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={() => this.handleCorrelateClick(variable.module_id, variable.id, variable.name)}
                        key={variable.module_id + '.' + variable.id}
                      >
                        {variable.name}
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <input
                type="number"
                name="correlationFactor"
                placeholder="Factor"
                className="form-control"
              />
            </div>
          </div>
          :
          null
        }

      </div>
    )
  }

  render() {
    return (
      <div>
        <div
          className={"modal fade" + (this.state.show ? ' show' : '')}
          tabIndex="-1"
          role="dialog"
          style={{ "display": (this.state.show ? 'block' : 'none') }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Variable</h5>
                <button type="button" className="close" onClick={this.close} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.renderNameInput()}
                {this.renderTypeDropdown()}
                {this.renderMethodDropdown()}
                {this.renderValueInput()}
                {this.renderCorrelate()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.close}>Close</button>
                <button type="button" className="btn btn-primary" onClick={this.submit}>Add Variable</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" style={{ "display": (this.state.show ? 'block' : 'none') }}></div>
      </div>
    );
  }
}

VarEditor.defaultProps = {
  n_clicks_timestamp: -1,
  show: false,
};

VarEditor.propTypes = {
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
   */
  data: PropTypes.shape({
    id: PropTypes.number,
    module_id: PropTypes.number,
    variables: PropTypes.array.isRequired,
  }),

  /**
   * An integer that represents the time (in ms since 1970)
   * at which n_clicks changed. This can be used to tell
   * which button was changed most recently.
   */
  'n_clicks_timestamp': PropTypes.number,

  /**
   * Placeholder
   */
  placeholder: PropTypes.string,

  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps: PropTypes.func,

  /**
   * Should the element be shown
   */
  show: PropTypes.bool,

  /**
   * Defines CSS styles which will override styles previously set.
   */
  'style': PropTypes.object,

};
