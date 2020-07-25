import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowLeftIcon from '@iconify/icons-uil/angle-left';

import PublicDeckInfo from '../../../components/User/PublicDeckInfo/PublicDeckInfo';
import PublicDeckCards from '../../../components/User/PublicDeckCards/PublicDeckCards';
import CardInfo from '../../../components/User/CardInfo/CardInfo';
import PracticeOptions from '../../../components/User/PracticeOptions/PracticeOptions';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import './PublicDeckDetail.css';

class PublicDeckDetail extends Component {
  UNSAFE_componentWillMount() {
    this.backUrl = this.props.location.state?.backUrl || '/market';
  }

  componentDidMount() {
    this.props.onGetPublicDeck(this.props.match.params.deckId);
  }

  componentWillUnmount() {
    this.props.onResetStateInPublicDeckDetailReducer();
  }

  handleCloseCard = () => {
    this.props.onUnselectCard();
  }

  handleClosePracticeOptions = () => {
    this.props.onSetPracticeOptionsOpen(false);
  }

  render() {
    const { deck, cards, selectedCard, practiceOptionsOpen } = this.props;

    return (
      <div className="public-deck-detail">
        <section className="left-section">
          <div className="back-feature">
            <Link to={this.backUrl}>
              <span className="back-feature-icon">
                <Icon icon={arrowLeftIcon} />
              </span>
              <span className="back-feature-label"> Back</span>
            </Link>
          </div>
          <PublicDeckInfo deck={deck} showLess={!!selectedCard} />
          {selectedCard && (
            <CardInfo card={selectedCard} closed={this.handleCloseCard} />
          )}
        </section>
        <section className="right-section">
          <PublicDeckCards />
        </section>
        <PracticeOptions
          deck={deck}
          cards={cards}
          isOpen={practiceOptionsOpen}
          onClose={this.handleClosePracticeOptions} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    deck: state.publicDeckDetail.deck,
    cards: state.publicDeckDetail.cards,
    selectedCard: state.publicDeckDetail.selectedCard,
    practiceOptionsOpen: state.deckDetail.practiceOptionsOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetPublicDeck: (deckId) => dispatch(actions.getPublicDeck(deckId)),
    onUnselectCard: () => dispatch(actions.unselectPublicDeckCard()),
    onResetStateInPublicDeckDetailReducer: () => dispatch(actions.resetStateInPublicDeckDetailReducer()),
    onSetPracticeOptionsOpen: (value) => dispatch(actions.setPracticeOptionsOpen(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(PublicDeckDetail));