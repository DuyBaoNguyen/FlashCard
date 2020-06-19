import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';
import selectionIcon from '@iconify/icons-bi/plus-circle';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';

import Search from '../../Shared/Search/Search';
import Button from '../../Shared/Button/Button';
import Card from '../Card/Card';
import * as actions from '../../../store/actions';
import './DeckCardsOutside.css';

const AMOUNT_CARDS = 9;

class DeckCardsOutside extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1
    };
  }

  componentDidMount() {
    this.deckId = this.props.match.params.deckId;
    this.props.onGetDeckCardsOutside(this.deckId, '');
  }

  componentDidUpdate() {
    if (this.state.activePage > 1 && this.props.cards.length < (this.state.activePage - 1) * AMOUNT_CARDS + 1) {
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
    this.props.onGetDeckCardsOutside(this.deckId, searchString);

    this.setState({ activePage: 1 });
  }

  handleAddCard = (cardId) => {
    this.props.onAddCard(this.deckId, cardId);
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
            <Card
              key={card.id}
              card={card}
              options={[
                {
                  type: 'link',
                  path: `/cards/${card.id}/edit`,
                  icon: <Icon icon={editIcon} color="#535353" />,
                  label: { value: 'Edit card' }
                },
                {
                  type: 'button',
                  icon: <Icon icon={deleteIcon} color="red" />,
                  label: { value: 'Delete card', color: 'red' },
                  onClick: () => this.handleDeleteCard(card.id)
                }
              ]}
              selectionIcon={<Icon icon={selectionIcon} color="#ddd" style={{ fontSize: 20 }} />}
              onSelect={this.handleAddCard}
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
      <div className="deck-cards-outside-wrapper">
        <div className="deck-cards-outside-header">
          <div className="deck-cards-outside-header-features">
            <Button
              type="link"
              path={'/cards/create'}
              className="deck-cards-outside-header-features-add"
              icon={<Icon icon={plusIcon} />}>
            </Button>
            <Search
              placeholder="Search..."
              onChange={this.handleSearchCards} />
          </div>
          <p>My cards</p>
        </div>
        <div className="cards">{cardsList}</div>
        <div className="cards-pagination">{pagination}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cards: state.deckDetail.remainingCards
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeckCardsOutside: (deckId, front) => dispatch(actions.getDeckCardsOutside(deckId, front)),
    onAddCard: (deckId, cardId) => dispatch(actions.addCard(deckId, cardId)),
    onUpdateSearchString: (value) => dispatch(actions.updateCardsOutsideSearchString(value))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeckCardsOutside));