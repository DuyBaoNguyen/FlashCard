import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import layerGroup from '@iconify/icons-uil/layer-group';
import calendarAlt from '@iconify/icons-uil/calendar-alt';

import './Deck.css';

class Deck extends Component {
  render() {
    return (
      <div className="deck">
        <Link to={`/deck/${this.props.deck.id}`}>
          <div className="wrapper">
            <div className="deck-background-color" style={{ background: this.props.deck.theme }}>
              <div className="deck-name">{this.props.deck.name}</div>
              <div className="deck-description">{this.props.deck.description}</div>
              <div className="deck-info">
                <div className="deck-info-value">
                  <Icon
                    icon={layerGroup}
                    style={{ color: '#ffffff', fontSize: '24px' }}
                  />
                  <p>{this.props.deck.totalCards}</p>
                </div>
                <div className="deck-info-value">
                  <Icon icon={calendarAlt} style={{ color: '#ffffff', fontSize: '24px' }} />
                  <p>{new Date(this.props.deck.createdDate).toLocaleDateString()}</p>
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