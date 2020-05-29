import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavigationItem.css';

const navigationItem = props => {
  return (
    <li className="navigation-item">
      <NavLink
        to={props.to}
        exact={props.exact}
        activeClassName="active">
        {props.label}
      </NavLink>
    </li>
  );
};

export default navigationItem;