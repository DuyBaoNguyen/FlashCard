import React from 'react';
import { Link } from 'react-router-dom';

import './DropDownItem.css';

const dropDownItem = props => {
  const classes = ['dropdown-item'];
  if (props.className !== undefined) {
    classes.push(props.className);
  }

  const dropDownItemContent = (
    <>
      <span className="dropdown-item-icon">
        {props.icon}
      </span>
      <span className="dropdown-item-label">
        {props.label}
      </span>
    </>
  );

  if (props.type === 'link') {
    return (
      <Link to={props.path} className="dropdown-item" onClick={props.onClick}>
        {dropDownItemContent}
      </Link>
    );
  }
  return (
    <span className={classes.join(' ')} onClick={props.onClick}>
      {dropDownItemContent}
    </span>
  );
};

export default dropDownItem;