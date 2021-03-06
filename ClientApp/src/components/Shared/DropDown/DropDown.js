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

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.open !== nextState.open || this.props.label !== nextProps.label ||
      this.props.changeable !== nextProps.changeable;
  }

  handleClickLabel = event => {
    event.stopPropagation();
    this.setState(state => {
      return { open: !state.open };
    });
  }

  handleClickOutside = event => {
    if (this.dropdown.current && !this.dropdown.current.contains(event.target)) {
      this.setState({ open: false });
    }
  }

  handleClickItem = () => {
    this.setState({ open: false });
  }

  handleMouseLeave = () => {
    if (this.state.open) {
      this.setState({ open: false });
    }
  }

  handleMouseEnter = () => {
    if (!this.state.open) {
      this.setState({ open: true });
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

    const menuClasses = ['dropdown-content'];
    if (this.props.right) {
      menuClasses.push('right');
    } else if (this.props.rightSide) {
      menuClasses.push('right-side');
    } else if (this.props.leftSide) {
      menuClasses.push('left-side');
    }

    const childrenWithProps = Children.map(this.props.children, child => {
      if (isValidElement(child)) {
        return cloneElement(child, { closeItem: this.handleClickItem });
      }
      return child;
    });

    return (
      <li
        className={classes.join(' ')}
        ref={this.dropdown}
        onMouseLeave={this.props.mouseLeaveToClose ? this.handleMouseLeave : null}
        onMouseEnter={this.props.mouseEnterToOpen ? this.handleMouseEnter : null}>
        <div className="dropdown-label" onClick={this.handleClickLabel}>
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