import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';
import editIcon from '@iconify/icons-uil/edit';
import removeIcon from '@iconify/icons-uil/minus-circle'
import deleteIcon from '@iconify/icons-uil/trash-alt';
import Pagination from 'react-js-pagination';
import { withRouter } from 'react-router-dom';

import Search from '../../Shared/Search/Search';
import Button from '../../Shared/Button/Button';
import Card from '../Card/Card';
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

  UNSAFE_componentWillMount() {
    this.deckId = this.props.match.params.deckId;
  }

  componentDidMount() {
    this.props.onGetDeckCardsInside(this.deckId);
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

  handleClickCard = (cardId) => {
    this.props.onSelectCard(cardId);
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  handleSearchCards = (event) => {
    const searchString = event.target.value;
    this.props.onUpdateSearchString(searchString);
    this.props.onGetDeckCardsInside(this.deckId, searchString);
    this.setState({ activePage: 1 });
  }

  handleRemoveCard = (cardId) => {
    this.props.onRemoveCard(this.deckId, cardId);
  }

  handleDeleteCard = (cardId) => {
    this.props.onDeleteCard(cardId);
  };

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
                  icon: <Icon icon={removeIcon} color="red" />,
                  label: { value: 'Remove card', color: 'red' },
                  onClick: () => this.handleRemoveCard(card.id)
                },
                {
                  type: 'button',
                  icon: <Icon icon={deleteIcon} color="red" />,
                  label: { value: 'Delete card', color: 'red' },
                  onClick: () => this.handleDeleteCard(card.id)
                }
              ]}
              onClick={this.handleClickCard} />
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
          onChange={this.handlePageChange.bind(this)}
          activeClass="pagination-item-active"
          itemClass="pagination-item"
        />
      );
    }
    return (
      <div className="deck-cards-wrapper">
        <div className="deck-cards-header">
          <p>Cards in deck</p>
          <div className="deck-cards-header-features">
            <Button
              type="link"
              path={`/decks/${this.deckId}/addcards`}
              className="deck-cards-header-features-add"
              icon={<Icon icon={plusIcon} />} >
            </Button>
            <Search
              placeholder="Search..."
              onChange={this.handleSearchCards} />
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
    cards: state.deckDetail.cards
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeckCardsInside: (id, front) => dispatch(actions.getDeckCardsInside(id, front)),
    onSelectCard: (id) => dispatch(actions.selectCardInDeckDetails(id)),
    onRemoveCard: (deckId, cardId) => dispatch(actions.removeCard(deckId, cardId)),
    onUpdateSearchString: (value) => dispatch(actions.updateCardsInsideSearchString(value)),
    onDeleteCard: (cardId) => dispatch(actions.deleteCard(cardId))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeckCards));