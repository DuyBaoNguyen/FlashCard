import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './DropDownItem.css';

class DropDownItem extends Component {
  handleClick = (event) => {
    event.stopPropagation();
    if (this.props.type) {
      this.props.closeItem();
    }
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    const classes = ['dropdown-item'];
    if (this.props.className !== undefined) {
      classes.push(this.props.className);
    }
    if (this.props.type) {
      classes.push('dropdown-item-hover');
    }

    const dropDownItemContent = (
      <>
        <span className="dropdown-item-icon">
          {this.props.icon}
        </span>
        <span className="dropdown-item-label" style={{ color: this.props.labelColor }}>
          {this.props.label}
        </span>
      </>
    );

    if (this.props.type === 'link') {
      return (
        <Link to={this.props.path} className={classes.join(' ')}>
          {dropDownItemContent}
        </Link>
      );
    }
    if (this.props.type === 'button') {
      return (
        <span className={classes.join(' ')} onClick={this.handleClick}>
          {dropDownItemContent}
        </span>
      );
    }
    if (this.props.type === 'line') {
      return (
        <span className="dropdown-item-line"></span>
      );
    }
    return (
      <span className={classes.join(' ')}>
        {dropDownItemContent}
        {this.props.children}
      </span>
    );
  }
}

export default DropDownItem;