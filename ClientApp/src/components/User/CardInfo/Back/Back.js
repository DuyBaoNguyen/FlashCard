import React from 'react';

import './Back.css';

const back = props => {
  const { back } = props;
  return (
    <div className="back">
      {back.imageUrl && (
        <img src={back.imageUrl} alt={back.meaning} width="100" height="100" />
      )}
      <p className="back-meaning back-field">{back.meaning}</p>
      <p className="back-type back-field"><i>{back.type}</i></p>
      <p className="back-example back-field">{back.example}</p>
    </div>
  );
};

export default back;