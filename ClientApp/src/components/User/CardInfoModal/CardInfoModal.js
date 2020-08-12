import React, { Component } from 'react';

import BackDrop from '../../Shared/BackDrop/BackDrop';
import CardInfo from '../CardInfo/CardInfo';
import './CardInfoModal.css';

class CardInfoModal extends Component {
  render() {
    const { card, onClose, open } = this.props;

    return (
      <div className="card-info-modal">
        <BackDrop isOpen={open} onClick={onClose} />
        {card && (
          <CardInfo card={card} closed={onClose} />
        )}
      </div>
    );
  }
}

export default CardInfoModal;