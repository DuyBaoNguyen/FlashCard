import React from 'react';

import './Container.css';

const container = props => (
  <div className="container">
    {props.children}
  </div>
);

export default container;