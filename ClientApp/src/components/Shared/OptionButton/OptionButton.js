import React from 'react';
import { Link } from 'react-router-dom';

import './OptionButton.css';

const optionButton = props => {
  const classes = ['option-button'];
  if (props.children === undefined && props.icon !== undefined) {
    classes.push('button-only-icon');
  }
  if (props.className !== undefined) {
    classes.push(props.className);
  }

  if (props.type === 'link') {
    return (
      <Link to={props.path} className={classes.join(' ')} style={props.style}>
        {!!props.icon && (
          <span className="icon">
            {props.icon}
          </span>
        )}
        {props.children}
      </Link>
    );
  }
  return (
    <button className={classes.join(' ')} onClick={props.onClick} style={props.style}>
      {!!props.icon && (
        <span className="icon">
          {props.icon}
        </span>
      )}
      {props.children}
    </button>
  );
};

export default optionButton;