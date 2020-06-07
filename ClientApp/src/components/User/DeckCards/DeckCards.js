import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';

import Search from '../../Shared/Search/Search';
import Button from '../../Shared/Button/Button';
import Card from './Card/Card';
import * as actions from '../../../store/actions';
import './DeckCards.css';

const AMOUNT_CARDS = 12;

class DeckCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1
    };
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  handleSearchCards(event) {
    this.props.onGetDeckCards(this.props.deck.id, event.target.value);
    this.setState({ activePage: 1 });
  }

  render() {
    const { deck, cards } = this.props;
    const { activePage } = this.state;
    let cardsList = <p style={{ color: '#979797' }}>There are no decks here!</p>;
    let pagination;

    if (cards.length > 0) {
      cardsList = cards.map((card, index) => {
        if (index >= (activePage - 1) * AMOUNT_CARDS && index <= activePage * AMOUNT_CARDS - 1) {
          return <Card key={card.id} card={card} />;
        }
      });

      pagination = (
        <Pagination
          hideFirstLastPages
          prevPageText="<"
          nextPageText=">"
          activePage={activePage}
          itemsCountPerPage={AMOUNT_CARDS}
          totalItemsCount={cards.length}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange.bind(this)}
          activeClass="pagination-item-active"
          itemClass="pagination-item"
        />
      );
    }
    return (
      <div className="deck-cards-wrapper">
        <div className="deck-cards-header">
          <p>My cards</p>
          <div className="deck-cards-header-features">
            <Button
              type="link"
              path={`/decks/${deck?.id}/addcards`}
              className="deck-cards-header-features-add"
              icon={<Icon icon={plusIcon} />} >
            </Button>
            <Search
              placeholder="Search..."
              onChange={(event) => this.handleSearchCards(event)} />
          </div>
        </div>
        <div className="cards">{cardsList}</div>
        <div className="cards-pagination">{pagination}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    deck: state.deckDetail.deck,
    cards: state.deckDetail.cards
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeckCards: (id, front) => dispatch(actions.getDeckCards(id, front))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeckCards);