import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { clone } from 'ramda';

import './VarEditor.css';
import { TYPE_METHOD_MAP } from '../../constants/typeMethodMap';
import { METHOD_VALUE_INPUT_MAP } from '../../constants/methodValueInputMap';
import { METHOD_NAME_MAP } from '../../constants/methodNameMap';
import { TYPE_NAME_MAP } from '../../constants/typeNameMap';

const initialState = {
  correlate: false,
  correlateDropdownIsOpen: false,
  correlatedTo: '',
  correlationFactor: '',
  formIsValid: false,
  modalBodyOverflowY: 'auto',
  modalBodyHeight: 'auto',
  modalTitle: 'Add Variable',
  newVarOptionValue: '',
  show: false,
  submitBtnText: 'Save Variable',
  varDescriptin: '',
  varId: '',
  varMethod: '',
  varMethodDropdownIsOpen: false,
  varName: '',
  varOptionValueDropdownIsOpen: false,
  varOptions: {},
  varTitle: '',
  varType: '',
  varTypeDropdownIsOpen: false,
  varValue0: '',
  varValue1: '',
  varValue2: '',
  varValue: '',
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
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOptionInputChange = this.handleOptionInputChange.bind(this);
    this.handleValueInputChange = this.handleValueInputChange.bind(this);
    this.handleVarOptionClick = this.handleVarOptionClick.bind(this);
    this.removeVariableOption = this.removeVariableOption.bind(this);
    this.renderCorrelate = this.renderCorrelate.bind(this);
    this.renderMethodDropdown = this.renderMethodDropdown.bind(this);
    this.renderNameInput = this.renderNameInput.bind(this);
    this.renderOptionVarOptions = this.renderOptionVarOptions.bind(this);
    this.renderTypeDropdown = this.renderTypeDropdown.bind(this);
    this.resetValues = this.resetValues.bind(this);
    this.setModelOverflow = this.setModelOverflow.bind(this);
    this.submit = this.submit.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.setModelOverflow();
  }

  componentWillReceiveProps(newProps) {
    // Show component if props.data contains new timestamp
    if (newProps.data.timestamp !== this.props.data.timestamp) {
      const variable = newProps.data.variable;
      // If no var just show the editor
      if (!variable) {
        this.setState({
          show: true,
          modalTitle: 'Create Variable',
          submitBtnText: 'Create Variable',
        });
        return;
      }

      // If a variable is passed, set all the values so we can edit
      const newState = {
        show: true,
        correlate: variable.correlation !== '' ? true : false,
        correlatedTo: variable.correlation || '',
        correlationFactor: variable.factor || '',
        modalTitle: 'Edit Variable',
        submitBtnText: 'Update Variable',
        varId: variable.id || '',
        varDescription: variable.description || '',
        varMethod: variable.method || '',
        varName: variable.name || '',
        varTitle: variable.title || '',
        varType: variable.type || '',
        varValue: variable.value.toString().trim() || '',
        varOptions: this.parseNewPropsOptions(variable.type, variable.value)
      }

      // Split the string value
      // valList could have a length from 1 to 4
      const valList = variable.value.toString().trim().split(/\s+/);
      // If the variable is a riskVariale index 0 in valList is the probability
      if (variable.type === 'riskVariable') {
        const propability = valList.shift();
        newState.varValueProbability = propability;
      }

      valList.map((v, i) => {
        newState[`varValue${i}`] = v;
      });
      this.setState(newState);
    }
  }

  parseNewPropsOptions(varType, varValue) {
    if (varType !== 'optionVariable') {
      return []
    }
    // Removing the first value, which is the default value
    // const varOptions = varValue.split(',')
    // varOptions.shift()
    const value = varValue.replace(/\s/g, '');
    // Split selected key from options
    const options = JSON.parse(value.split(/,(?={)/)[1])
    return options
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  // handleVarOptionInputChange(event) {
  //   const target = event.target;
  //   const value = target.value;
  //   const name = target.name;
  // }

  handleValueInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value }, () => {
      const {
        varMethod,
        varType,
        varValueProbability
      } = this.state;

      // Set the output value (i.e. varValue) based on varMethod
      let varValue = '';

      // if its a risk variable to need to add probability
      if (varType === 'riskVariable') {
        varValue += varValueProbability;
      }

      METHOD_VALUE_INPUT_MAP[varMethod].map((v, i) => {
        varValue += ' ' + this.state[`varValue${i}`];
      })

      this.setState({ varValue: varValue.trim() })
    });
  }

  submit(event) {
    event.preventDefault();
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

  resetValues() {
    this.setState({
      varValue: '',
      varValue0: '',
      varValue1: '',
      varValue2: '',
      varValueProbability: '',
    })
  }

  formIsValid() {

    const { varType, varMethod, varOptions, varValue } = this.state;

    switch (varType) {
      case 'variable':
        if (varMethod === '') {
          this.setState({ varMethodMissing: true })
          return false;
        }
        return true;
      case 'riskVariable':
        if (varMethod === '') {
          this.setState({ varMethodMissing: true })
          return false;
        }
        return true;
      case 'timeseries':
        return true;
      case 'optionVariable':
        // Check if we have atleast two options
        if (varOptions.length < 2) {
          this.setState({ varOptionsMissing: true })
          return false
        }
        this.setState({ varOptionsMissing: false })
        if (varValue === '') {
          this.setState({ varValueMissing: true })
          return false
        }
        return true
      default:
        this.setState({ varTypeMissing: true })
        return false;
    }
  }

  valueProbabilityIsValid() {
    const v = parseFloat(this.state.varValueProbability.replace(',', '.'), 10);
    if (v >= 0 && v <= 1) {
      return true;
    }
    return false;
  }

  setModelOverflow() {
    const modalBodyHeight = this.modalRef.clientHeight;
    const modalBodyClientHeight = this.modalBodyRef.clientHeight;
    const modalBodyInnerHeight = this.modalBodyRef.innerHeight;
    // const modalBodyHeight = this.modalBodyRef.height;
    const modalBodyOffsetHeight = this.modalBodyRef.offsetHeight;
    const windowHeight = window.innerHeight;
    const modalMargins = 200;

    const availableSpace = windowHeight - modalMargins;
    const requiredModalSpace = modalBodyHeight - (modalBodyHeight - modalBodyHeight)




    if (availableSpace < requiredModalSpace) {
      this.setState({
        modalBodyOverflowY: 'scroll',
        modalBodyHeight: 'calc(100vh - 200px)'
      })
    } else {
      this.setState({ modalBodyOverflowY: '-webkit-paged-y' })
    }
  }

  toggle(attr, close = false) {

    this.setModelOverflow();

    if (close) {
      this.setState({
        [attr]: false
      });
    }
    else {
      this.setState({
        [attr]: !this.state[attr]
      });
    }
  }

  renderTitleInput() {
    return (
      <div className="form-group">
        {/* <label htmlFor="varTitle">Title</label> */}
        <input
          autoFocus
          type="string"
          name="varTitle"
          id="varTitle"
          placeholder="Variable Title"
          onChange={this.handleInputChange}
          value={this.state.varTitle}
          className="form-control"
          required={true}
        />
      </div>
    )
  }

  renderNameInput() {
    return (
      <div className="form-group">
        {/* <label htmlFor="varName">Name (Used for reference in functions)</label> */}
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

  renderDescriptionInput() {
    return (
      <div className="form-group">
        {/* <label htmlFor="varDescription">Description</label> */}
        <input
          autoFocus
          type="string"
          name="varDescription"
          id="varDescription"
          placeholder="Description of variable"
          onChange={this.handleInputChange}
          value={this.state.varDescription}
          className="form-control"
        />
      </div>
    )
  }

  renderTypeDropdown() {
    const missing = this.state.varTypeMissing;
    return (
      <div className="form-group">
        {/* <label htmlFor="varType">Type</label> */}
        <div className="dropdown">
          <button
            className={'btn btn-block' + (missing ? ' btn-danger' : ' btn-outline-secondary')}
            type="button"
            onClick={() => this.toggle('varTypeDropdownIsOpen')}
          >
            {TYPE_NAME_MAP[this.state.varType] || "(Choose variable type)"}
          </button>
          <div
            className="dropdown-menu w-100"
            style={{ 'display': this.state.varTypeDropdownIsOpen ? 'block' : 'none' }}
          >
            <a className="dropdown-item" href="#" onClick={() => this.handleTypeClick('variable')}>Variable</a>
            <a className="dropdown-item" href="#" onClick={() => this.handleTypeClick('riskVariable')}>Risk Variable</a>
            <a className="dropdown-item" href="#" onClick={() => this.handleTypeClick('timeseries')}>Timeseries</a>
            <a className="dropdown-item" href="#" onClick={() => this.handleTypeClick('optionVariable')}>Option Variable</a>
          </div>
        </div>
      </div>
    )
  }

  handleMethodClick(methodVal) {
    this.resetValues();
    this.setState({
      varMethod: methodVal,
      varMethodDropdownIsOpen: false,
    })
  }

  handleTypeClick(typeVal) {
    this.resetValues();
    this.setState({
      varType: typeVal,
      varTypeDropdownIsOpen: false,
      varMethod: '',
      varTypeMissing: false
    })
  }

  handleCorrelateClick(varName) {
    this.setState({
      correlatedTo: varName,
      correlateDropdownIsOpen: false,
    })
  }

  /**
   * Auto-increment the varOptions key
   * @param {Object} varOptions
   */
  getNextOptionId(varOptions) {
    if (Object.keys(varOptions).length === 0) {
      return 1
    }

    const highestId = Object.keys(varOptions).reduce((a, b) => varOptions[a] > varOptions[b] ? a : b);
    const nextId = parseInt(highestId, 10) + 1;
    return nextId;
  }

  handleAddOption(e) {
    e.preventDefault();
    const newVarOptionValue = this.state.newVarOptionValue
    if (newVarOptionValue === '') {
      this.setState({ varOptionsMissing: true })
      return;
    }
    const newVarOptions = clone(this.state.varOptions);
    const nextOptionId = this.getNextOptionId(newVarOptions)
    newVarOptions[nextOptionId] = newVarOptionValue
    this.setState({
      varOptions: newVarOptions,
      newVarOptionValue: ''
    }, () => {
      if (this.state.varOptions.length >= 2) {
        this.setState({ varOptionsMissing: false })
      }
    })
    this.toggle('varOptionValueDropdownIsOpen', true);
  }

  /**
   * The varValue for an optionVariable
   * is the default value followed by the avaiable options:
   * <defaultValue,{1,"1":"optionA","2":"optionB","n":"optionN"}>
   * e.g.: 1,{1:"apple",2:"banana",3:"orange"}
   * @param {string|int} option The selected option from the dropdown
   */
  handleVarOptionClick(optionKey) {
    const options = clone(this.state.varOptions);
    const varValue = optionKey + ',' + JSON.stringify(options)
    this.setState({
      varValue,
      varValueMissing: false
    })
    this.toggle('varOptionValueDropdownIsOpen', true)
  }

  handleOptionInputChange(event, optionIndex) {
    const value = event.target.value
    const varOptions = [...this.state.varOptions]
    varOptions[optionIndex] = value
    this.setState({ varOptions, varValue: '' })
  }

  removeVariableOption(optionKey) {
    const varOptions = clone(this.state.varOptions);
    delete varOptions[optionKey]

    // Reset index for all options
    const newVarOptions = {}
    Object.keys(varOptions).map((key, i) => {
      newVarOptions[i+1] = varOptions[key]
    })
    this.setState({ varOptions: newVarOptions })
    this.toggle('varOptionValueDropdownIsOpen', true);
  }

  renderOptionVarOptions() {
    const { varOptions, varOptionsMissing } = this.state;

    if (this.state.varType !== 'optionVariable') {
      return null;
    }
    return (
      <div className="form-group">
        <label htmlFor="varMethod">Define variable options</label>
        {
          Object.keys(varOptions).length > 0 ?
            Object.keys(varOptions).map((key, i) => {
              return (
                <div className="input-group mb-1" key={i}>
                  <input
                    type="text"
                    name={`varOptionValue-${i}`}
                    className="form-control"
                    value={varOptions[key]}
                    onChange={e => this.handleOptionInputChange(e, i)} />
                  <div className="input-group-append">
                    <button className="btn btn-outline-danger" type="button" onClick={() => this.removeVariableOption(key)}>
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
              )
            })
            : null

        }
        <input
          type="text"
          name="newVarOptionValue"
          className={"form-control" + (varOptionsMissing ? ' is-invalid' : '')}
          onChange={this.handleInputChange}
          value={this.state.newVarOptionValue} />
        <button
          onClick={(e) => this.handleAddOption(e)}
          className={"btn btn-block btn-sm" + (varOptionsMissing ? ' btn-danger' : ' btn-secondary')}>
          {varOptionsMissing ? 'Add atleast two options' : 'Add another option'}
        </button>
      </div>
    )
  }

  renderMethodDropdown() {

    if (!['variable', 'riskVariable', 'timeseries'].includes(this.state.varType)) {
      return null;
    }

    const missing = this.state.varMethodMissing;

    return (
      <div className="form-group">
        <label htmlFor="varMethod">Method</label>
        <div className="dropdown">
          <button
            className={"btn btn-block" + (missing ? ' btn-danger' : ' btn-outline-secondary')}
            type="button"
            onClick={() => this.toggle('varMethodDropdownIsOpen')}
          >
            {METHOD_NAME_MAP[this.state.varMethod] || "(Choose variable method)"}
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

  renderVariableOptionValueDropdown() {
    if (this.state.varOptions.length < 1 || this.state.varType !== 'optionVariable') {
      return null;
    }

    const {varValueMissing, varValue, varOptions} = this.state;
    const optionKey = varValue.split(',')[0]

    return (
      <div className="form-group">
        <label htmlFor="varMethod">Option Value</label>
        <div className="dropdown">
          <button
            className={"btn btn-block" + (varValueMissing ? ' btn-danger' : ' btn-outline-secondary')}
            type="button"
            onClick={() => this.toggle('varOptionValueDropdownIsOpen')}
          >
            {
              varValue ?
                `${optionKey}: ${varOptions[optionKey]}`
                : "(Choose option value)"
            }
          </button>
          <div
            className="dropdown-menu w-100 dropdown-menu--scrollbale"
            style={{ 'display': this.state.varOptionValueDropdownIsOpen ? 'block' : 'none' }}
          >
            {
              Object.keys(this.state.varOptions).map((key, i) => {
                return (
                  <a key={i}
                    className="dropdown-item"
                    href="#"
                    onClick={() => this.handleVarOptionClick(key)}
                  >
                    {`${key}: ${this.state.varOptions[key]}`}
                  </a>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }

  renderProbabilityInput() {
    if (this.state.varType === 'riskVariable') {
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
            value={this.state.varValueProbability}
            className="form-control"
          />
        </div>
      )
    }
    return null;
  }

  /**
   * Render value inputs fields based on varMethod.
   */
  renderValueInput() {

    if (!this.state.varMethod) {
      return null;
    }

    const valueInputs = METHOD_VALUE_INPUT_MAP[this.state.varMethod];

    // Generate x number of input fields based on varType
    return (
      <div className="form-group">
        <label>Value</label>
        <div className="d-flex">
          {this.renderProbabilityInput()}
          {valueInputs.map((v, i) => {
            const name = `varValue${i}`;
            return (
              <div key={i} className="flex-even">
                <input
                  className="form-control"
                  id={name}
                  max={v.max}
                  min={v.min}
                  name={name}
                  onChange={this.handleValueInputChange}
                  placeholder={v.placeholder}
                  required={true}
                  step={v.step}
                  type={v.type}
                  value={this.state[name]}
                />
              </div>
            )
          })
          }
        </div>
      </div>
    )
  }

  renderCorrelate() {
    if (!['variable', 'riskVariable', 'timeseries'].includes(this.state.varType)) {
      return null;
    }
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
                  {this.state.correlatedTo || "(Choose variable to correlate with)"}
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

    const bodyStyle = {
      overflowY: this.state.modalBodyOverflowY,
      maxHeight: this.state.modalBodyHeight,
    }

    return (
      <div>
        <div
          className={"modal fade" + (this.state.show ? ' show' : '')}
          tabIndex="-1"
          role="dialog"
          style={{ "display": (this.state.show ? 'block' : 'none') }}
        >
          <div className="VarEditor modal-dialog" role="document" ref={(el) => { this.modalRef = el }} >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.state.modalTitle}</h5>
                <button type="button" className="close" onClick={this.close} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form onSubmit={this.submit}>
                <div className="modal-body" style={bodyStyle} ref={(el) => { this.modalBodyRef = el }} >
                  {this.renderTitleInput()}
                  {this.renderNameInput()}
                  {this.renderDescriptionInput()}
                  {this.renderTypeDropdown()}
                  {this.renderMethodDropdown()}
                  {this.renderOptionVarOptions()}
                  {this.renderValueInput()}
                  {this.renderVariableOptionValueDropdown()}
                  {this.renderCorrelate()}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={this.close}>Close</button>
                  <button className="btn btn-primary">{this.state.submitBtnText}</button>
                </div>
              </form>
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
