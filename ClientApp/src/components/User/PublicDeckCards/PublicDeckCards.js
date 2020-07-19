import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { withRouter } from 'react-router-dom';

import Card from '../../User/Card/Card';
import Loading from '../../Shared/Loading/Loading';
import Search from '../../Shared/Search/Search';
import Filter from '../../Shared/Filter/Filter';
import * as actions from '../../../store/actions';
import { TIME_OUT_DURATION } from '../../../applicationConstants';
import './PublicDeckCards.css';

const AMOUNT_CARDS = 12;

class PublicDeckCards extends Component {
  state = {
    activePage: 1,
    setLoading: false
  };

  componentDidMount() {
    const { match, onGetPublicDeckCards, loading } = this.props;
    const { setLoading } = this.state;

    onGetPublicDeckCards(match.params.deckId);

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

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  handleSearchCards = (event) => {
    const searchString = event.target.value;
    this.props.onUpdateSearchString(searchString);
    this.props.onGetPublicDeckCards(this.props.match.params.deckId, searchString);
    this.setState({ activePage: 1 });
  }

  handleChangeFilteredValue = (event) => {
    const filteredValue = event.target.value;
    this.props.onSetFilteredValue(filteredValue);
    this.props.onFilterCards(filteredValue);
    this.setState({ activePage: 1 });
  }

  render() {
    const { cards, loading } = this.props;
    const { activePage, setLoading } = this.state;
    let cardsList = loading ? setLoading && <Loading /> : <p className="text-notify">There are no cards here!</p>;
    let pagination;

    if (cards.length > 0 && !loading) {
      cardsList = (
        <div className="cards">
          {cards.filter((card, index) => index >= (activePage - 1) * AMOUNT_CARDS && index <= activePage * AMOUNT_CARDS - 1)
            .map(card => {
              return (
                <Card
                  key={card.id}
                  card={card}
                  displayStatus
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
          onChange={this.handlePageChange}
          activeClass="pagination-item-active"
          itemClass="pagination-item"
        />
      );
    }
    return (
      <div className="public-deck-cards-wrapper">
        <div className="public-deck-cards-header">
          <p>Cards in deck</p>
          <div className="public-deck-cards-header-features">
            <Filter
              className="public-deck-cards-header-features-filter"
              onChange={this.handleChangeFilteredValue}>
              <option value="all">All</option>
              <option value="remembered">Remembered</option>
              <option value="not remembered">Not remembered</option>
            </Filter>
            <Search
              placeholder="Search..."
              onChange={this.handleSearchCards} />
          </div>
        </div>
        {cardsList}
        <div className="cards-pagination">{pagination}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cards: state.publicDeckDetail.cards,
    loading: state.publicDeckDetail.getCardsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetPublicDeckCards: (deckId, front) => dispatch(actions.getPublicDeckCards(deckId, front)),
    onSelectCard: (cardId) => dispatch(actions.selectPublicDeckCard(cardId)),
    onUpdateSearchString: (value) => dispatch(actions.updatePublicDeckCardsSearchString(value)),
    onSetFilteredValue: (value) => dispatch(actions.setPublicDeckCardsFilteredValue(value)),
    onFilterCards: (value) => dispatch(actions.filterPublicDeckCards(value))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PublicDeckCards));