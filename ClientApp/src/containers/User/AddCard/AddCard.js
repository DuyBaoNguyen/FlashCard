import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import withErroHandler from '../../../hoc/withErrorHandler';
import DeckCardsInside from '../../../components/User/DeckCardsInside/DeckCardsInside';
import DeckCardsOutside from '../../../components/User/DeckCardsOutside/DeckCardsOutside';
import './AddCard.css';

class AddCard extends Component {
  UNSAFE_componentWillMount() {
    this.deckId = this.props.match.params.deckId;
  }

  render() {
    return (
      <div className="add-cards">
        <section className="top-section">
          <Link to={`/decks/${this.deckId}`}>
            <div className="back-feature">
              <span className="back-feature-label">Done</span>
            </div>
          </Link>
        </section>
        <section className="left-section">
          <DeckCardsInside />
        </section>
        <section className="right-section">
          <DeckCardsOutside />
        </section>
      </div>
    );
  }
}

export default withErroHandler(AddCard);