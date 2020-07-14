import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowLeftIcon from '@iconify/icons-uil/angle-left';

import Statistics from '../../../components/User/Statistics/Statistics';
import DeckInfo from '../../../components/User/DeckInfo/DeckInfo';
import DeckCards from '../../../components/User/DeckCards/DeckCards';
import CardInfo from '../../../components/User/CardInfo/CardInfo';
import PracticeOptions from '../../../components/User/PracticeOptions/PracticeOptions';
import withErrorHandler from '../../../hoc/withErrorHandler';
import { Roles } from '../../../applicationConstants';
import * as actions from '../../../store/actions/index';
import './DeckDetail.css';

class DeckDetail extends Component {
  UNSAFE_componentWillMount() {
    this.backUrl = this.props.location.state?.backUrl || '/';
  }

  componentDidMount() {
    this.deckId = this.props.match.params.deckId;
    this.props.onGetDeck(this.deckId);
    this.props.onGetDeckStatistics(this.deckId);
  }

  componentWillUnmount() {
    this.props.onResetStateInDeckDetailReducer();
  }

  handleCloseCard = () => {
    this.props.onUnselectCard();
  }

  handleClosePracticeOptions = () => {
    this.props.onSetPracticeOptionsOpen(false);
  }

  render() {
    const {
      profile,
      deck,
      percentPracticedCardsStatistics,
      amountRememberedCardsStatistics,
      selectedCard,
      practiceOptionsOpen
    } = this.props;

    return (
      <div className="deck-detail">
        <section className="left-section">
          <div className="back-feature">
            <Link to={this.backUrl}>
              <span className="back-feature-icon">
                <Icon icon={arrowLeftIcon} />
              </span>
              <span className="back-feature-label"> Back</span>
            </Link>
          </div>
          <DeckInfo deck={deck} showLess={!!selectedCard} />
          {selectedCard && (
            <CardInfo card={selectedCard} closed={this.handleCloseCard} />
          )}
          {profile?.role === Roles.User && (
            <Statistics
              className={selectedCard ? "statistics-hidden" : null}
              percentPracticedCardsChartData={percentPracticedCardsStatistics}
              amountRememberedCardsChartData={amountRememberedCardsStatistics} />
          )}
        </section>
        <section className="right-section">
          <DeckCards />
        </section>
        <PracticeOptions
          isOpen={practiceOptionsOpen}
          onClose={this.handleClosePracticeOptions} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.home.profile,
    deck: state.deckDetail.deck,
    percentPracticedCardsStatistics: state.deckDetail.percentPracticedCardsStatistics,
    amountRememberedCardsStatistics: state.deckDetail.amountRememberedCardsStatistics,
    selectedCard: state.deckDetail.selectedCard,
    practiceOptionsOpen: state.deckDetail.practiceOptionsOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeck: (id) => dispatch(actions.getDeck(id)),
    onGetDeckStatistics: (id) => dispatch(actions.getDeckStatistics(id)),
    onUnselectCard: () => dispatch(actions.unselectCardInDeckDetails()),
    onResetStateInDeckDetailReducer: () => dispatch(actions.resetStateInDeckDetailReducer()),
    onSetPracticeOptionsOpen: (value) => dispatch(actions.setPracticeOptionsOpen(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(DeckDetail));