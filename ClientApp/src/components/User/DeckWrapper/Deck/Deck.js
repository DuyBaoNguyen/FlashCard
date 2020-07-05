import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import clockIcon from '@iconify/icons-uil/clock';
import cardIcon from '@iconify/icons-mdi/credit-card-outline';
import succeededCardIcon from '@iconify/icons-mdi/credit-card-check-outline';
import failedCardIcon from '@iconify/icons-mdi/credit-card-remove-outline';

import './Deck.css';

class Deck extends Component {
  render() {
    return (
      <div className="deck">
        <Link to={`/decks/${this.props.deck.id}`}>
          <div className="wrapper">
            <div className="deck-background-color" style={{ background: this.props.deck.theme }}>
              <div className="deck-name">{this.props.deck.name}</div>
              <div className="deck-description">{this.props.deck.description}</div>
              <div className="deck-info">
                {this.props.deck.lastTestedTime !== null && (
                  <div className="deck-info-value-container">
                    <div className="deck-info-value">
                      <Icon icon={clockIcon} style={{ color: '#ffffff', fontSize: '24px' }} />
                      <p>{this.props.deck.lastTestedTime}</p>
                    </div>
                  </div>
                )}
                <div className="deck-info-value-container">
                  <div className="deck-info-value">
                    <Icon icon={cardIcon} style={{ color: '#ffffff', fontSize: '24px' }} />
                    <p>
                      {this.props.deck.totalCards}
                      {this.props.deck.completed && (
                        <span className="completed-badge">
                          {this.props.deck.completed && ("Completed")}
                        </span>
                      )}
                    </p>
                  </div>
                  {!this.props.deck.completed && (
                    <>
                      <div className="deck-info-value">
                        <Icon icon={succeededCardIcon} style={{ color: '#ffffff', fontSize: '24px' }} />
                        <p>{this.props.deck.totalSucceededCards}</p>
                      </div>
                      <div className="deck-info-value">
                        <Icon icon={failedCardIcon} style={{ color: '#ffffff', fontSize: '24px' }} />
                        <p>{this.props.deck.totalFailedCards}</p>
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

export default Deck;
