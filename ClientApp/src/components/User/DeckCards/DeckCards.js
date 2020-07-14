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
import Filter from '../../Shared/Filter/Filter';
import Card from '../Card/Card';
import Loading from '../../Shared/Loading/Loading';
import Confirm from '../../Shared/Confirm/Confirm';
import * as actions from '../../../store/actions';
import { TIME_OUT_DURATION } from '../../../applicationConstants';
import './DeckCards.css';

const AMOUNT_CARDS = 12;

class DeckCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      setLoading: false,
      deletedCardId: null,
      removedCardId: null
    };
  }

  UNSAFE_componentWillMount() {
    this.deckId = this.props.match.params.deckId;
  }

  componentDidMount() {
    this.props.onGetDeckCardsInside(this.deckId);

    if (!this.state.setLoading && !this.timeoutNumber) {
      setTimeout(() => {
        if (this.props.loading) {
          this.setState({ setLoading: true });
        }
      }, TIME_OUT_DURATION);
    }
  }

  componentDidUpdate() {
    if (this.state.activePage > 1 && this.props.cards.length < (this.state.activePage - 1) * AMOUNT_CARDS + 1) {
      this.setState(state => {
        return { activePage: state.activePage - 1 };
      });
    }
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

  handleRemoveCard = () => {
    this.props.onRemoveCard(this.deckId, this.state.removedCardId);
    this.setState({ removedCardId: null });
  }

  handleDeleteCard = () => {
    this.props.onDeleteCard(this.state.deletedCardId);
    this.setState({ deletedCardId: null });
  };

  handleFilteredValueChange = (event) => {
    this.props.onSetCardsInsideFilteredValue(event.target.value);
    this.props.onFilterCardsInside(event.target.value);
    this.setState({ activePage: 1 });
  }

  handleOpenDeletingConfirm = (cardId) => {
    this.setState({ deletedCardId: cardId });
  }

  handleCloseDeletingConfirm = () => {
    this.setState({ deletedCardId: null });
  }

  handleOpenRemovingConfirm = (cardId) => {
    this.setState({ removedCardId: cardId });
  }

  handleCloseRemovingConfirm = () => {
    this.setState({ removedCardId: null });
  }

  render() {
    const { cards, loading } = this.props;
    let { activePage, setLoading, deletedCardId, removedCardId } = this.state;
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
                  displayStatus
                  card={card}
                  options={[
                    {
                      type: 'link',
                      path: { pathname: `/cards/${card.id}/edit`, state: { backUrl: `/decks/${this.deckId}` } },
                      icon: <Icon icon={editIcon} color="#646464" />,
                      label: { value: 'Edit card' }
                    },
                    {
                      type: 'button',
                      icon: <Icon icon={removeIcon} color="red" />,
                      label: { value: 'Remove card', color: 'red' },
                      onClick: () => this.handleOpenRemovingConfirm(card.id)
                    },
                    {
                      type: 'button',
                      icon: <Icon icon={deleteIcon} color="red" />,
                      label: { value: 'Delete card', color: 'red' },
                      onClick: () => this.handleOpenDeletingConfirm(card.id)
                    }
                  ]}
                  onClick={this.handleClickCard} />
              );
            })}
        </div>
      )

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
            <Filter
              className="deck-card-header-features-filter"
              onChange={this.handleFilteredValueChange}>
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
        <Confirm
          isOpen={!!deletedCardId}
          header="Delete"
          message="Are you sure you want to delete this card?"
          confirmLabel="Delete"
          confirmColor="#fe656d"
          onCancel={this.handleCloseDeletingConfirm}
          onConfirm={this.handleDeleteCard}>
        </Confirm>
        <Confirm
          isOpen={!!removedCardId}
          header="Remove"
          message="Are you sure you want to remove this card from deck?"
          confirmLabel="Remove"
          confirmColor="#fe656d"
          onCancel={this.handleCloseRemovingConfirm}
          onConfirm={this.handleRemoveCard}>
        </Confirm>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cards: state.deckDetail.cards,
    loading: state.deckDetail.loadings.getCardsInsideLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeckCardsInside: (id, front) => dispatch(actions.getDeckCardsInside(id, front)),
    onSelectCard: (id) => dispatch(actions.selectCardInDeckDetails(id)),
    onRemoveCard: (deckId, cardId) => dispatch(actions.removeCard(deckId, cardId)),
    onUpdateSearchString: (value) => dispatch(actions.updateCardsInsideSearchString(value)),
    onDeleteCard: (cardId) => dispatch(actions.deleteCard(cardId)),
    onFilterCardsInside: (filteredValue) => dispatch(actions.filterCardsInside(filteredValue)),
    onSetCardsInsideFilteredValue: (filteredValue) => dispatch(actions.setCardsInsideFilteredValue(filteredValue))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeckCards));