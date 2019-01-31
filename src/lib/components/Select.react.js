import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
export default class Select extends Component {
    render() {
        // const {id, className, setProps, options} = this.props;
        const {id, className} = this.props;

        return (
          <select className={className} id={id}>
            <option>1</option>
            <option>2</option>
          </select>
        )

        // return (
        //     <div id={id}>
        //         ExampleComponent: {label}&nbsp;
        //         <input
        //             value={value}
        //             onChange={e => {
        //                 /*
        //                  * Send the new value to the parent component.
        //                  # setProps is a prop that is automatically supplied
        //                  * by dash's front-end ("dash-renderer").
        //                  * In a Dash app, this will send the data back to the
        //                  * Python Dash app server.
        //                  * If the component properties are not "subscribed"
        //                  * to by a Dash callback, then Dash dash-renderer
        //                  * will not pass through `setProps` and it is expected
        //                  * that the component manages its own state.
        //                  */
        //                  if (setProps) {
        //                      setProps({
        //                         value: e.target.value
        //                     });
        //                 } else {
        //                     this.setState({
        //                         value: e.target.value
        //                     })
        //                 }
        //             }}
        //         />
        //     </div>
        // );
    }
}

Select.defaultProps = {};

Select.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks
     */
    id: PropTypes.string,

    /**
     * ClassName
     */
    className: PropTypes.string,

    // /**
    //  * The value displayed in the input
    //  */
    // options: PropTypes.string,

    // /**
    //  * Dash-assigned callback that should be called whenever any of the
    //  * properties change
    //  */
    // setProps: PropTypes.func
};
