import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { withRouter } from 'react-router-dom';

import Card from '../../User/Card/Card';
import Loading from '../../Shared/Loading/Loading';
import * as actions from '../../../store/actions';
import { TIME_OUT_DURATION } from '../../../applicationConstants';
import './ProposedPublicDeckCards.css';

const AMOUNT_CARDS = 12;

class ProposedPublicDeckCards extends Component {
  state = {
    activePage: 1,
    setLoading: false
  };

  componentDidMount() {
    const { match, onGetCards, loading } = this.props;
    const { setLoading } = this.state;

    onGetCards(match.params.deckId);

    if (!setLoading) {
      setTimeout(() => {
        if (loading) {
          this.setState({ setLoading: true });
        }
      }, TIME_OUT_DURATION);
    }
  }

  handleClickCard = (cardId) => {
    this.props.onSelectCard(cardId);
  }

  handlePageChanged = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  render() {
    const { cards, loading } = this.props;
    const { activePage, setLoading } = this.state;
    let cardsList = loading ? setLoading && <Loading /> : <p className="text-notify">There are no cards here!</p>;
    let pagination;

    if (cards.length > 0 && !loading) {
      cardsList = (
        <div className="cards">
          {cards
            .filter((_, index) => index >= (activePage - 1) * AMOUNT_CARDS && index <= activePage * AMOUNT_CARDS - 1)
            .map(card => {
              return (
                <Card
                  key={card.id}
                  card={card}
                  notSpeaker
                  onClick={this.handleClickCard} />
              );
            })}
        </div>
      )

      pagination = (
        <Pagination
          hideFirstLastPages
          prevPageText="<"
          nextPageText=">"
          activePage={activePage}
          itemsCountPerPage={AMOUNT_CARDS}
          totalItemsCount={cards.length}
          pageRangeDisplayed={5}
          onChange={this.handlePageChanged}
          activeClass="pagination-item-active"
          itemClass="pagination-item"
        />
      );
    }
    return (
      <div className="proposed-public-deck-cards-wrapper">
        <div className="proposed-public-deck-cards-header">
          <p>Cards in deck</p>
        </div>
        {cardsList}
        <div className="cards-pagination">{pagination}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cards: state.proposedPublicDeckDetail.publicDeckCards,
    loading: state.proposedPublicDeckDetail.getPublicDeckCardsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCards: (deckId) => dispatch(actions.getProposedPublicDeckCards(deckId)),
    onSelectCard: (cardId) => dispatch(actions.selectProposedPublicDeckCard(cardId))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProposedPublicDeckCards));