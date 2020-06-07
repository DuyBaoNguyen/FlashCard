import React from 'react';

import './Card.css';

const card = props => (
  <div className="card-wrapper">
    <div className="card">
      {props.card.front}
    </div>
  </div>
);

export default card;