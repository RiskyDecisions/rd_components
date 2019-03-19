import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { pick } from 'ramda';

import './VarEditor.css';
import { TYPE_METHOD_MAP } from '../../constants';

const initialState = {
  correlate: false,
  correlateDropdownIsOpen: false,
  correlatedTo: '',
  correlationFactor: '',
  formIsValid: false,
  modalTitle: 'Add Variable',
  show: false,
  submitBtnText: 'Save Variable',
  varId: '',
  varMethod: '',
  varMethodDropdownIsOpen: false,
  varName: '',
  varTitle: '',
  varType: '',
  varTypeDropdownIsOpen: false,
  varValue: '',
  varValue0: '',
  varValueHigh: '',
  varValueLow: '',
  varValueMid: '',
  varValueProbability: '',
}

/**
 * VarEditor component
 *
 * This component will be shown whenever a new timestamp
 * is passed via props data object.
 */
export default class VarEditor extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

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
    // Show component if props.data contains new timestamp
    if (newProps.data.timestamp !== this.props.data.timestamp) {

      const variable = newProps.data.variable;

      // If no var just show the editor
      if (!variable) {
        this.setState({
          show: true,
          modalTitle: 'Add Variable',
          submitBtnText: 'Save Variable',
        });
        return;
      }

      // If a variable is passed, set all the values so we can edit
      const parsedValues = this.parseIncomingValue(variable.type, variable.method, variable.value);

      this.setState({
        show: true,
        correlate: variable.correlation !== '' ? true : false,
        correlatedTo: variable.correlation || '',
        correlationFactor: variable.factor || '',
        modalTitle: 'Edit Variable',
        submitBtnText: 'Update Variable',
        varId: variable.id || '',
        varMethod: variable.method || '',
        varName: variable.name || '',
        varTitle: variable.title || '',
        varType: variable.type || '',
        varValue: variable.value || '',
        varValueProbability: parsedValues.varValueProbability || '',
        varValue0: parsedValues.varValue0 || '',
        varValueLow: parsedValues.varValueLow || '',
        varValueMid: parsedValues.varValueMid || '',
        varValueHigh: parsedValues.varValueHigh || '',
      });
    }
  }

  parseIncomingValue(varType, varMethod, varValue) {

    let value = varValue.toString();
    let varValue0 = '';
    let varValueLow = '';
    let varValueMid = '';
    let varValueHigh = '';
    let varValueProbability = '';

    // Fist check if it is a risk variable to extract probability
    if (varType === 'riskVariable') {
      const valList = value.split(/\s+/);
      varValueProbability = valList[0];
      value = valList.slice(1).join(' ');
    } else {
      varValueProbability = '';
    }

    if (varType !== 'function') {
      const valList = value.split(/\s+/);
      varValueLow = valList[0];
      varValueMid = valList[1];
      varValueHigh = valList[2];
    }

    if (['constant', 'binomial', 'bernoulli', 'function'].includes(varMethod)) {
      varValue0 = value;
    }

    const ret = {
      varValue0: varValue0,
      varValueLow: varValueLow,
      varValueMid: varValueMid,
      varValueHigh: varValueHigh,
      varValueProbability: varValueProbability,
    }

    return ret;

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
      const {
        varMethod,
        varValue0,
        varValueHigh,
        varValueLow,
        varValueMid,
        varValueProbability
      } = this.state;
      if (['constant', 'binomial', 'bernoulli', 'function'].includes(varMethod)) {
        let varValue = `${varValue0}`;
        // If varType is a risk variable we must append the probability
        varValue = this.state.varType === 'riskVariable'
          ? `${varValueProbability} ${varValue}`
          : `${varValue}`;
        this.setState({ varValue: varValue })
      } else {
        let varValue = `${varValueLow} ${varValueMid} ${varValueHigh}`;
        varValue = this.state.varType === 'riskVariable'
          ? `${varValueProbability} ${varValue}`
          : `${varValue}`;
        this.setState({ varValue: varValue })
      }
    });
  }

  submit() {
    const varData = {
      id: this.state.varId,
      correlation: this.state.correlatedTo,
      factor: this.state.correlationFactor,
      method: this.state.varMethod,
      module_id: this.props.data.moduleId,
      name: this.state.varName.split(' ').join('_').toLowerCase(),
      type: this.state.varType,
      value: this.state.varValue,
      timestamp: this.props.data.timestamp,
      title: this.state.varTitle,
    }

    if (this.props.setProps && this.formIsValid()) {
      this.props.setProps({
        submit_timestamp: Date.now(),
        data: varData
      });
      this.close()
    }
  }

  close() {
    this.setState(initialState);
  }

  formIsValid() {
    let isValid = true;
    const varsToVerify = [
      'varMethod',
      'varName',
      'varTitle',
      'varType',
      'varValue',
    ]
    // TODO:
    // validata 'varValue' properly
    const vars = pick(varsToVerify, this.state)

    for (const i in vars) {
      const val = vars[i];
      if (val === '') {
        isValid = false;
      }
    }

    // Validate riskVariable
    if (
      this.state.varType === 'riskVariable'
      && !this.valueProbabilityIsValid()) {
      return false;
    }

    return isValid;
  }

  valueProbabilityIsValid() {
    const v = parseFloat(this.state.varValueProbability.replace(',', '.'), 10);
    if (v >= 0 && v <= 1) {
      return true;
    }
    return false;
  }

  toggle(attr) {
    this.setState({
      [attr]: !this.state[attr]
    });
  }

  renderTitleInput() {
    return (
      <div className="form-group">
        <label htmlFor="varTitle">Title</label>
        <input
          autoFocus
          type="string"
          name="varTitle"
          id="varTitle"
          placeholder="Variable Title"
          onChange={this.handleInputChange}
          value={this.state.varTitle}
          className="form-control"
        />
      </div>
    )
  }

  renderNameInput() {
    return (
      <div className="form-group">
        <label htmlFor="varName">Name (Used for reference in functions)</label>
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
            <a className="dropdown-item" href="#" onClick={() => this.handleTypeClick('riskVariable')}>Risk Variable</a>
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

  handleCorrelateClick(varName) {
    this.setState({
      correlatedTo: varName,
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
              className="dropdown-menu w-100 dropdown-menu--scrollbale"
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

  renderProbabilityInput() {
    if (this.state.varType === 'riskVariable') {
      return (
        <div className="form-group">
          <label htmlFor="varValueProbability">Probability (between 0 and 1)</label>
          <input
            min="0"
            max="1"
            step=".1"
            type="number"
            name="varValueProbability"
            id="varValueProbability"
            placeholder='Probability of event'
            onChange={this.handleValueInputChange}
            value={this.state.varValueProbability}
            className="form-control"
          />
        </div>
      )
    }
    return null;
  }

  renderValueInput() {

    const methodPlaceholderMap = {
      'function': "Function Expression",
      'binomial': "Probability (between 0 and 1)",
      'bernoulli': "Probability (between 0 and 1)",
    }

    if (['constant', 'binomial', 'bernoulli', 'function'].includes(this.state.varMethod)) {
      return (
        <div className="form-group">
          <label htmlFor="varValue0">Value</label>
          <input
            type="string"
            name="varValue0"
            id="varValue0"
            placeholder={methodPlaceholderMap[this.state.varMethod]}
            onChange={this.handleValueInputChange}
            value={this.state.varValue0}
            className="form-control"
            disabled={this.state.varMethod ? false : true}
          />
        </div>
      )
    }
    else if (this.state.varType === 'timeseries') {
      return (
        <div className="form-group">
          <label>Value</label>
          <div className="form-row">
            <div className="col-sm-4">
              <input
                placeholder="Total"
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
                placeholder="Duration"
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
                placeholder="Start"
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
                        onClick={() => this.handleCorrelateClick(variable.name)}
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
                onChange={this.handleInputChange}
                value={this.state.correlationFactor}
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
          <div className="VarEditor modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.state.modalTitle}</h5>
                <button type="button" className="close" onClick={this.close} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.renderTitleInput()}
                {this.renderNameInput()}
                {this.renderTypeDropdown()}
                {this.renderMethodDropdown()}
                {this.renderProbabilityInput()}
                {this.renderValueInput()}
                {this.renderCorrelate()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.close}>Close</button>
                <button type="button" className="btn btn-primary" onClick={this.submit}>{this.state.submitBtnText}</button>
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
  submit_timestamp: -1,
  data: {
    timestamp: 0
  }
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
   *
   * moduleId: which module to add var to
   * variables: array with all project vars
   * timestamp: must pass a new timestamp to show the component
   */
  data: PropTypes.shape({
    id: PropTypes.number,
    moduleId: PropTypes.number,
    variables: PropTypes.array,
    timestamp: PropTypes.number,
    variable: PropTypes.shape({
      'correlation': PropTypes.string,
      'factor': PropTypes.string,
      'id': PropTypes.string,
      'method': PropTypes.string,
      'name': PropTypes.string,
      'title': PropTypes.string,
      'type': PropTypes.string,
      'value': PropTypes.string,
    })
  }),

  /**
   * An integer that represents the time (in ms since 1970)
   * at which n_clicks changed. This can be used to tell
   * which button was changed most recently.
   */
  'submit_timestamp': PropTypes.number,

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
   * Defines CSS styles which will override styles previously set.
   */
  'style': PropTypes.object,

};
