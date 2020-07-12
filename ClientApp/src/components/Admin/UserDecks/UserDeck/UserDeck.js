import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
// import clockIcon from '@iconify/icons-uil/clock';
import cardIcon from '@iconify/icons-mdi/credit-card-outline';
// import succeededCardIcon from '@iconify/icons-mdi/credit-card-check-outline';
// import failedCardIcon from '@iconify/icons-mdi/credit-card-remove-outline';

import './UserDeck.css';

class UserDeck extends Component {
  render() {
    const { user, deck } = this.props;

    return (
      <div className="user-deck">
        <Link to={{
          pathname: `/admin/users/${user.id}/decks/${deck.id}`,
          state: { backUrl: '/admin/users' }
        }}>
          <div className="wrapper">
            <div className="deck-background-color" style={{ background: deck.theme }}>
              <div className="deck-name">{deck.name}</div>
              <div className="deck-description">{deck.description}</div>
              <div className="deck-info">
                <div className="deck-info-value-container">
                  <div className="deck-info-value">
                    <Icon icon={cardIcon} style={{ color: '#ffffff', fontSize: '24px' }} />
                    <p>
                      {deck.totalCards}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="deck-background-white-1"></div>
            <div className="deck-background-white-2"></div>
          </div>
        </Link>
      </div>
    );
  }
}

export default UserDeck;
