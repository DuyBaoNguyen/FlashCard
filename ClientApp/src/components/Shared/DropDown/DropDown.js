import React, { Component } from 'react';

import './DropDown.css';

class DropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
    this.dropdown = React.createRef();
  }

  handleClick = () => {
    this.setState(state => {
      return { open: !state.open }
    });
  }

  handleClickOutside = event => {
    if (this.dropdown.current && !this.dropdown.current.contains(event.target)) {
      this.setState({ open: false });
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const classes = ['dropdown'];
    if (this.props.className !== undefined) {
      classes.push(this.props.className);
    }

    return (
      <li className={classes.join(' ')} ref={this.dropdown} onClick={this.handleClick}>
        {this.props.label}
        <span className="postfix">
          {this.props.postfix}
        </span>
        {this.state.open && (
          <div className="dropdown-content">
            {this.props.children}
          </div>
        )}
      </li>
    );
  }
}

export default DropDown;