import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component that setProps on enter
 */
export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  render() {
    const { id, className, setProps, type = 'text' } = this.props;

    return (
      <input
        id={id}
        className={className}
        type={type}
        value={this.state.value}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            if (setProps) {
              setProps({
                value: e.target.value,
              });
            }
          }
        }}
        onChange={e => {
          this.setState({
            value: e.target.value,
          });
        }}
      />
    );
  }
}

Input.defaultProps = {};

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
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps: PropTypes.func,

  /**
   * Type
   */
  type: PropTypes.string,

  /**
   * The value displayed in the input
   */
  value: PropTypes.string,
};
