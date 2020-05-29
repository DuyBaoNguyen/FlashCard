import React from 'react';
import Icon from '@iconify/react';
import { Link } from 'react-router-dom';

import './NavigationDropDown.css';

const navigationDropDown = props => {
  let items;
  if (props.items !== null) {
    items = props.items.map((item, index) => (
      <div className="dropdown-item" key={index}>
        <span className="dropdown-item-icon">
          <Icon icon={item.icon} />
        </span>
        <span className="dropdown-item-label">
          <Link to={item.to}>{item.label}</Link>
        </span>
      </div>
    ));
  }

  return (
    <li className="navigation-dropdown">
      {props.label}
      <div className="dropdown-content">
        {items}
      </div>
    </li>
  );
};

export default navigationDropDown;