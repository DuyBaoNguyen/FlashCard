import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import clockIcon from '@iconify/icons-uil/clock';
import cardIcon from '@iconify/icons-mdi/credit-card-outline';
import succeededCardIcon from '@iconify/icons-mdi/credit-card-check-outline';
import failedCardIcon from '@iconify/icons-mdi/credit-card-remove-outline';

import { Roles } from '../../../../applicationConstants';
import './Deck.css';

class Deck extends Component {
  render() {
    const { deck, profile } = this.props;

    return (
      <div className="deck">
        <Link to={`/decks/${deck.id}`}>
          <div className="wrapper">
            <div className="deck-background-color" style={{ background: deck.theme }}>
              <div className="deck-name">{deck.name}</div>
              <div className="deck-description">{deck.description}</div>
              <div className="deck-info">
                {profile?.role === Roles.User && deck.lastTestedTime !== null && (
                  <div className="deck-info-value-container">
                    <div className="deck-info-value">
                      <Icon icon={clockIcon} style={{ color: '#ffffff', fontSize: '24px' }} />
                      <p>{deck.lastTestedTime}</p>
                    </div>
                  </div>
                )}
                <div className="deck-info-value-container">
                  <div className="deck-info-value">
                    <Icon icon={cardIcon} style={{ color: '#ffffff', fontSize: '24px' }} />
                    <p>
                      {deck.totalCards}
                      {profile?.role === Roles.User && deck.completed && (
                        <span className="completed-badge">
                          {deck.completed && ("Completed")}
                        </span>
                      )}
                    </p>
                  </div>
                  {profile?.role === Roles.User && !deck.completed && (
                    <>
                      <div className="deck-info-value">
                        <Icon icon={succeededCardIcon} style={{ color: '#ffffff', fontSize: '24px' }} />
                        <p>{deck.totalSucceededCards}</p>
                      </div>
                      <div className="deck-info-value">
                        <Icon icon={failedCardIcon} style={{ color: '#ffffff', fontSize: '24px' }} />
                        <p>{deck.totalFailedCards}</p>
                      </div>
                    </>
                  )}
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

const mapStateToProps = state => {
  return {
    profile: state.home.profile
  };
};

export default connect(mapStateToProps)(Deck);
