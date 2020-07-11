import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowLeftIcon from '@iconify/icons-uil/angle-left';

import Statistics from '../../../components/User/Statistics/Statistics';
import DeckInfo from '../../../components/User/DeckInfo/DeckInfo';
import DeckCards from '../../../components/User/DeckCards/DeckCards';
import CardInfo from '../../../components/User/CardInfo/CardInfo';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import './DeckDetail.css';
import { connect } from 'react-redux';

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

  render() {
    const {
      deck,
      percentPracticedCardsStatistics,
      amountRememberedCardsStatistics,
      selectedCard
    } = this.props;
    let leftSection;
    
    if (selectedCard) {
      leftSection = (
        <>
          <DeckInfo deck={deck} showLess />
          <CardInfo card={selectedCard} closed={this.handleCloseCard} />
        </>
      );
    } else {
      leftSection = (
        <>
          <DeckInfo deck={deck} />
          <Statistics
            percentPracticedCardsChartData={percentPracticedCardsStatistics}
            amountRememberedCardsChartData={amountRememberedCardsStatistics} />
        </>
      );
    }

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
          {leftSection}
        </section>
        <section className="right-section">
          <DeckCards />
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    deck: state.deckDetail.deck,
    percentPracticedCardsStatistics: state.deckDetail.percentPracticedCardsStatistics,
    amountRememberedCardsStatistics: state.deckDetail.amountRememberedCardsStatistics,
    selectedCard: state.deckDetail.selectedCard
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeck: (id) => dispatch(actions.getDeck(id)),
    onGetDeckStatistics: (id) => dispatch(actions.getDeckStatistics(id)),
    onUnselectCard: () => dispatch(actions.unselectCardInDeckDetails()),
    onResetStateInDeckDetailReducer: () => dispatch(actions.resetStateInDeckDetailReducer())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(DeckDetail));