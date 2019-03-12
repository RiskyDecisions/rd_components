import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { pick } from 'ramda';

import './ModuleEditor.css';

const initialState = {
  name: '',
  description: '',
  image_url: '',
  id: null,
  project_id: null,
  show: false,
  include_in_report: true,
}

/**
 * ModuleEditor component
 *
 * This component will be shown whenever a new timestamp
 * is passed via props data object.
 */
export default class ModuleEditor extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.close = this.close.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderNameInput = this.renderNameInput.bind(this);
    this.renderDescriptionInput = this.renderDescriptionInput.bind(this);
    this.renderIncludeInReportCheckbox = this.renderIncludeInReportCheckbox.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    // Show component if props.data contains new timestamp
    if (newProps.data.timestamp !== this.props.data.timestamp) {
      const {
        id,
        project_id,
        name,
        description,
        include_in_report,
        image_url
      } = newProps.data;

      console.log('newProps.data: ', newProps.data);

      this.setState({
        id: id,
        name: name || '',
        description: description || '',
        include_in_report: include_in_report,
        image_url: image_url || '',
        project_id: project_id,
        modalTitle: id ? 'Edit Module': 'Add Module',
        submitBtnText: id ? 'Update Module': 'Save Module',
        show: true,
      }, () => {
        console.log('this.state: ', this.state);
      });
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  submit() {
    const moduleData = {
      project_id: this.props.data.project_id,
      name: this.state.name,
      timestamp: this.props.data.timestamp,
      description: this.state.description,
      include_in_report: this.state.include_in_report,
      image_url: this.state.image_url,
    }

    // If there is an id pass it back.
    // Returning no id from ModuleEditor signals we
    // are adding a new module.
    if (this.state.id) {
      moduleData.id = this.state.id;
    }

    if (this.props.setProps && this.formIsValid()) {
      this.props.setProps({
        submit_timestamp: Date.now(),
        data: moduleData
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
      'name',
      'project_id',
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

    return isValid;
  }

  renderDescriptionInput() {
    return (
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          type="string"
          name="description"
          id="description"
          placeholder="Module Description"
          onChange={this.handleInputChange}
          value={this.state.description}
          className="form-control"
        />
      </div>
    )
  }

  renderNameInput() {
    return (
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          autoFocus
          type="string"
          name="name"
          id="name"
          placeholder="Name of module"
          onChange={this.handleInputChange}
          value={this.state.name}
          className="form-control"
        />
      </div>
    )
  }

  renderImageUrlInput() {
    return (
      <div className="form-group">
        <label htmlFor="image_url">Module Image</label>
        <input
          autoFocus
          type="string"
          name="image_url"
          id="image_url"
          placeholder="Add an image url"
          onChange={this.handleInputChange}
          value={this.state.image_url}
          className="form-control"
        />
      </div>
    )
  }

  renderIncludeInReportCheckbox() {
    return (
      <div className="form-group">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            name="include_in_report"
            onChange={this.handleInputChange}
            value={this.state.include_in_report}
            checked={this.state.include_in_report}
            id="include_in_report"
          />
          <label className="custom-control-label" htmlFor="include_in_report">Include Module in Report</label>
        </div>
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
          <div className="ModuleEditor modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.state.modalTitle}</h5>
                <button type="button" className="close" onClick={this.close} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.renderNameInput()}
                {this.renderDescriptionInput()}
                {this.renderImageUrlInput()}
                {this.renderIncludeInReportCheckbox()}
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

ModuleEditor.defaultProps = {
  submit_timestamp: -1,
  data: {
    timestamp: 0
  }
};

ModuleEditor.propTypes = {
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
    project_id: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    image_url: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    include_in_report: PropTypes.bool,
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
