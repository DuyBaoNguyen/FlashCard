import React, { Component } from 'react';

import './Switch.css';

class Switch extends Component {
  constructor(props) {
    super(props);
    this.checkbox = React.createRef();
  }

  componentDidMount() {
    this.checkbox.current.checked = this.props.checked;
  }

  render() {
    return (
      <span className='switch'>
        <input
          className="switch-checkbox"
          id="switch-new"
          type="checkbox"
          ref={this.checkbox}
          onChange={this.props.onChange} />
        <label className="switch-label" htmlFor="switch-new">
          <span className="switch-button" />
        </label>
      </span>
    );
  }
};

export default Switch;