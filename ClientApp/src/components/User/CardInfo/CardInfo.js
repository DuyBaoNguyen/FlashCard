import React from 'react';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify/icons-uil/multiply';

import Back from './Back/Back';
import './CardInfo.css';

const cardInfo = props => {
  const { card, closed } = props;
  const backs = card.backs.map(back => {
    return <Back key={back.id} back={back} />
  });

  return (
    <div className="card-info">
      <div className="back-card">
        {backs}
        <span className="close-btn" onClick={closed}>
          <Icon icon={closeIcon} color="#979797" style={{ fontSize: 16 }} />
        </span>
      </div>
    </div>
  );
}

export default cardInfo;