import React from 'react';

import './Input.css';

const input = props => {
  const classes = ['input'];
  if (props.touched && !props.valid) {
    classes.push('invalid');
  }

  return (
    <input
      type="text"
      className={classes.join(' ')}
      name={props.name}
      defaultValue={props.defaultValue}
      autoComplete="off"
      autoFocus={props.autoFocus}
      onChange={props.onChange} />
  );
};

export default input;