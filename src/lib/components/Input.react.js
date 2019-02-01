import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'ramda';

/**
 * Input component that setProps on enter
 */
export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <input
        value={this.state.value}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            if (this.props.setProps) {
              this.props.setProps({
                value: e.target.value,
                n_clicks_timestamp: Date.now(),
              });
            }
          }
        }}
        onChange={e => {

          this.setState({
            value: e.target.value,
          });
        }}
        {...omit(['n_clicks_timestamp', 'value'], this.props)}
      />
    );
  }
}

Input.defaultProps = {
  n_clicks_timestamp: -1,
  show: true,
};

Input.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id: PropTypes.string,

  /**
   * ClassName
   */
  className: PropTypes.string,

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

  /**
   * Type
   */
  type: PropTypes.string,

  /**
   * The value displayed in the input
   */
  value: PropTypes.string,
};
