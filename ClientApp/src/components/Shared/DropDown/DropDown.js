import React, { Component, Children, isValidElement, cloneElement } from 'react';

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
    if (!this.state.open) {
      this.setState({ open: true });
    }
  }

  handleClickOutside = event => {
    if (this.dropdown.current && !this.dropdown.current.contains(event.target)) {
      this.setState({ open: false });
    }
  }

  handleCloseClick = () => {
    this.setState({ open: false });
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

    const menuClasses = ['dropdown-content'];
    if (this.props.right) {
      menuClasses.push('right');
    }

    const childrenWithProps = Children.map(this.props.children, child => {
      if (isValidElement(child)) {
        return cloneElement(child, { handleCloseClick: this.handleCloseClick });
      }
      return child;
    });

    return (
      <li className={classes.join(' ')} ref={this.dropdown} onClick={this.handleClick}>
        <div className="dropdown-label">
          {this.props.label}
          <span className="postfix">
            {this.props.postfix}
          </span>
        </div>
        {this.state.open && (
          <div className={menuClasses.join(' ')}>
            {childrenWithProps}
          </div>
        )}
      </li>
    );
  }
}

export default DropDown;