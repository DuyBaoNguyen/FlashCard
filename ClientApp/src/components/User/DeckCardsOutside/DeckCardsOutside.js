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
import Filter from '../../Shared/Filter/Filter';
import Card from '../Card/Card';
import Loading from '../../Shared/Loading/Loading';
import Confirm from '../../Shared/Confirm/Confirm';
import { TIME_OUT_DURATION, Roles } from '../../../applicationConstants';
import * as actions from '../../../store/actions';
import './DeckCardsOutside.css';

const AMOUNT_CARDS = 9;

class DeckCardsOutside extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      setLoading: false,
      deletedCardId: null
    };
  }

  componentDidMount() {
    this.deckId = this.props.match.params.deckId;
    this.props.onGetDeckCardsOutside(this.deckId, '');

    if (!this.state.setLoading) {
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

  handleDeleteCard = () => {
    this.props.onDeleteCard(this.state.deletedCardId);
    this.setState({ deletedCardId: null });
  }

  handleFilteredValueChange = (event) => {
    this.props.onSetCardsOutsideFilteredValue(event.target.value);
    this.props.onFilterCardsOutside(event.target.value);
    this.setState({ activePage: 1 });
  }

  handleOpenDeletingConfirm = (cardId) => {
    this.setState({ deletedCardId: cardId });
  }

  handleCloseDeletingConfirm = () => {
    this.setState({ deletedCardId: null });
  }

  render() {
    const { cards, loading, profile } = this.props;
    let { activePage, setLoading, deletedCardId } = this.state;
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
                  options={[
                    {
                      type: 'link',
                      path: { pathname: `/cards/${card.id}/edit`, state: { backUrl: `/decks/${this.deckId}/addcards` } },
                      icon: <Icon icon={editIcon} color="#646464" />,
                      label: { value: 'Edit card' }
                    },
                    {
                      type: 'button',
                      icon: <Icon icon={deleteIcon} color="red" />,
                      label: { value: 'Delete card', color: 'red' },
                      onClick: () => this.handleOpenDeletingConfirm(card.id)
                    }
                  ]}
                  selectionIcon={<Icon icon={selectionIcon} style={{ fontSize: 20 }} />}
                  onSelect={this.handleAddCard}
                  onDelete={this.handleDeleteCard} />
              );
            })}
        </div>
      );

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
          <p>My cards</p>
          <div className="deck-cards-outside-header-features">
            <Button
              type="link"
              path={{ pathname: '/cards/create', state: { backUrl: `/decks/${this.deckId}/addcards` } }}
              className="deck-cards-outside-header-features-add"
              icon={<Icon icon={plusIcon} />}>
            </Button>
            {profile?.role === Roles.User && (
              <Filter
                className="deck-cards-outside-header-features-filter"
                onChange={this.handleFilteredValueChange}>
                <option value="all">All</option>
                <option value="remembered">Remembered</option>
                <option value="not remembered">Not remembered</option>
              </Filter>
            )}
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.home.profile,
    cards: state.deckDetail.remainingCards,
    loading: state.deckDetail.loadings.getCardsOutsideLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeckCardsOutside: (deckId, front) => dispatch(actions.getDeckCardsOutside(deckId, front)),
    onAddCard: (deckId, cardId) => dispatch(actions.addCard(deckId, cardId)),
    onUpdateSearchString: (value) => dispatch(actions.updateCardsOutsideSearchString(value)),
    onDeleteCard: (cardId) => dispatch(actions.deleteCard(cardId)),
    onFilterCardsOutside: (filteredValue) => dispatch(actions.filterCardsOutside(filteredValue)),
    onSetCardsOutsideFilteredValue: (filteredValue) => dispatch(actions.setCardsOutsideFilteredValue(filteredValue))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeckCardsOutside));