import React from 'react';

import './Select.css';

const select = props => {
  return (
    <select
      className="select"
      name={props.name}
      defaultValue={props.defaultValue}
      onChange={props.onChange}>
      {props.children}
    </select>
  );
};

export default select;