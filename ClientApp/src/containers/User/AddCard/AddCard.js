import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import withErroHandler from '../../../hoc/withErrorHandler';
import DeckCardsInside from '../../../components/User/DeckCardsInside/DeckCardsInside';
import DeckCardsOutside from '../../../components/User/DeckCardsOutside/DeckCardsOutside';
import * as actions from '../../../store/actions';
import './AddCard.css';

class AddCard extends Component {
  UNSAFE_componentWillMount() {
    this.deckId = this.props.match.params.deckId;
  }

  componentWillUnmount() {
    this.props.onResetStateInDeckDetailReducer();
  }

  render() {
    return (
      <div className="add-cards">
        <section className="top-section">
          <div className="back-feature">
            <Link to={`/decks/${this.deckId}`}>
              <span className="back-feature-label">Done</span>
            </Link>
          </div>
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

const mapDispatchToProps = dispatch => {
  return {
    onResetStateInDeckDetailReducer: () => dispatch(actions.resetStateInDeckDetailReducer())
  };
};

export default connect(null, mapDispatchToProps)(withErroHandler(AddCard));