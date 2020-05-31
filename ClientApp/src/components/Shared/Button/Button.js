import React from 'react';
import './Button.css';

const button = props => {
  const classes = ['button'];
  if (props.children === undefined && props.icon !== undefined) {
    classes.push('button-only-icon');
  }
  if (props.className !== undefined) {
    classes.push(props.className);
  }

  return (
    <button
      className={classes.join(' ')}
      onClick={props.onClick}>
      {!!props.icon && (
        <span className="icon">
          {props.icon}
        </span>
      )}
      {props.children}
    </button>
  );
};

export default button;