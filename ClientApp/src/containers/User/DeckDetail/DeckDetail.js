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
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.deckId = this.props.match.params.deckId;
    this.props.onGetDeck(this.deckId);
    this.props.onGetDeckStatistics(this.deckId);
    this.props.onGetDeckCards(this.deckId, '');
  }

  handleCloseCard = () => {
    this.props.onUnselectCard();
  }

  render() {
    const { deck, statistics, selectedCard, returnUrl } = this.props;
    let leftSection;
    if (selectedCard) {
      leftSection = <CardInfo card={selectedCard} closed={this.handleCloseCard} />;
    } else {
      leftSection = (
        <>
          <DeckInfo deck={deck} />
          <Statistics data={statistics} />
        </>
      );
    }

    return (
      <div className="deck-detail">
        <section className="left-section">
          <Link to={returnUrl || '/'}>
            <div className="back-feature">
              <span className="back-feature-icon">
                <Icon icon={arrowLeftIcon} />
              </span>
              <span className="back-feature-label"> Back</span>
            </div>
          </Link>
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
    statistics: state.deckDetail.statistics,
    cards: state.deckDetail.cards,
    selectedCard: state.deckDetail.selectedCard
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeck: (id) => dispatch(actions.getDeck(id)),
    onGetDeckStatistics: (id) => dispatch(actions.getDeckStatistics(id)),
    onGetDeckCards: (id, front) => dispatch(actions.getDeckCards(id, front)),
    onUnselectCard: () => dispatch(actions.unselectCardInDeckDetails())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(DeckDetail));