import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import selectionIcon from '@iconify/icons-bi/dash-circle';

import Search from '../../Shared/Search/Search';
import SelectableCard from '../SelectableCard/SelectableCard';
import * as actions from '../../../store/actions';
import './DeckCardsInside.css';

const AMOUNT_CARDS = 9;

class DeckCardsInside extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1
    };
  }

  componentDidMount() {
    this.deckId = this.props.match.params.deckId;
    this.props.onGetDeckCardsInside(this.deckId);
  }

  componentDidUpdate() {
    if (this.props.cards.length < (this.state.activePage - 1) * AMOUNT_CARDS + 1) {
      this.setState(state => {
        return { activePage: state.activePage - 1 };
      });
    }
  }

  componentWillUnmount() {
    this.props.onUpdateSearchString('');
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  handleSearchCards = (event) => {
    const searchString = event.target.value;
    this.props.onUpdateSearchString(searchString)
    this.props.onGetDeckCardsInside(this.deckId, searchString);
    this.setState({ activePage: 1 });
  }

  handleRemoveCard = (cardId) => {
    this.props.onRemoveCard(this.deckId, cardId);
  }

  handleDeleteCard = (cardId) => {

  }

  render() {
    const { cards } = this.props;
    let { activePage } = this.state;
    let cardsList = <p className="text-notify">There are no cards here!</p>;
    let pagination;

    if (cards.length > 0) {
      cardsList = cards
        .filter((card, index) => index >= (activePage - 1) * AMOUNT_CARDS && index <= activePage * AMOUNT_CARDS - 1)
        .map(card => {
          return (
            <SelectableCard
              selectionIcon={<Icon icon={selectionIcon} color="#ddd" style={{ fontSize: 20 }} />}
              key={card.id}
              card={card}
              onSelect={this.handleRemoveCard}
              onDelete={this.handleDeleteCard} />
          );
        });

      if (cards.length < (activePage - 1) * AMOUNT_CARDS + 1) {
        activePage--;
      }

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
      <div className="deck-cards-inside-wrapper">
        <div className="deck-cards-inside-header">
          <div className="deck-cards-inside-header-features">
            <Search
              placeholder="Search..."
              onChange={this.handleSearchCards} />
          </div>
          <p>Cards in deck</p>
        </div>
        <div className="cards">{cardsList}</div>
        <div className="cards-pagination">{pagination}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cards: state.deckDetail.cards
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeckCardsInside: (deckId, front) => dispatch(actions.getDeckCardsInside(deckId, front)),
    onRemoveCard: (deckId, cardId) => dispatch(actions.removeCard(deckId, cardId)),
    onUpdateSearchString: (value) => dispatch(actions.updateCardsInsideSearchString(value))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeckCardsInside));