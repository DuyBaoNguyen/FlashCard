import React from 'react';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify/icons-uil/multiply';

import Back from '../Back/Back';
import './CardInfo.css';

const cardInfo = props => {
  const { card, closed, unableClose } = props;
  let back;
  let front;

  if (card) {
    front = (
      <div className="front">
        {card.front}
      </div>
    );
    back = card.backs.map(back => {
      return <Back key={back.id} back={back} />
    });
  } else {
    back = (
      <p className="text-notify">Click a card to see more information!</p>
    );
  }

  return (
    <div className="card-info">
      <div className="card">
        {front}
        {back}
        {!unableClose && (
          <span className="close-btn" onClick={closed}>
            <Icon icon={closeIcon} style={{ fontSize: 16 }} />
          </span>
        )}
      </div>
    </div>
  );
}

export default cardInfo;