import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowLeftIcon from '@iconify/icons-uil/angle-left';

import Statistics from '../../../components/User/Statistics/Statistics';
import DeckInfo from '../../../components/User/DeckInfo/DeckInfo';
import './DeckDetail.css';

class DeckDetail extends Component {
  UNSAFE_componentWillMount() {
    this.deckId = this.props.match.params.deckId;
  }

  render() {
    return (
      <div className="deck-detail">
        <section className="left-section">
          <Link to="/">
            <div className="back-feature">
              <span className="back-feature-icon">
                <Icon icon={arrowLeftIcon} />
              </span>
              <span className="back-feature-label"> Back</span>
            </div>
          </Link>
          <DeckInfo />
          <Statistics />
        </section>
        <section className="right-section">
          <div className="deck-cards"></div>
        </section>
      </div>
    );
  }
}

export default DeckDetail;