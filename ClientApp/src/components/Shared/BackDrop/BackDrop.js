import React from 'react';

import './BackDrop.css';

const backDrop = props => {
  return (
    <div
      className="backdrop"
      style={{ display: props.isOpen ? 'block' : 'none' }}
      onClick={props.onClick}>
    </div>
  );
};

export default backDrop;