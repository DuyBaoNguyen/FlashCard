import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import selectionIcon from '@iconify/icons-bi/dash-circle';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';

import Search from '../../Shared/Search/Search';
import Filter from '../../Shared/Filter/Filter';
import Card from '../Card/Card';
import Loading from '../../Shared/Loading/Loading';
import * as actions from '../../../store/actions';
import { TIME_OUT_DURATION } from '../../../applicationConstants';
import './DeckCardsInside.css';

const AMOUNT_CARDS = 9;

class DeckCardsInside extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      setLoading: false
    };
  }

  componentDidMount() {
    this.deckId = this.props.match.params.deckId;
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
    this.props.onDeleteCard(cardId);
  }

  handleFilteredValueChange = (event) => {
    this.props.onSetCardsInsideFilteredValue(event.target.value);
    this.props.onFilterCardsInside(event.target.value);
    this.setState({ activePage: 1 });
  }

  render() {
    const { cards, loading } = this.props;
    let { activePage, setLoading } = this.state;
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
                      onClick: () => this.handleDeleteCard(card.id)
                    }
                  ]}
                  selectionIcon={<Icon icon={selectionIcon} style={{ fontSize: 20 }} />}
                  onSelect={this.handleRemoveCard}
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
      <div className="deck-cards-inside-wrapper">
        <div className="deck-cards-inside-header">
          <p>Cards in deck</p>
          <div className="deck-cards-inside-header-features">
            <Filter
              className="deck-cards-inside-header-features-filter"
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cards: state.deckDetail.cards,
    loading: state.deckDetail.loadings.getCardsOutsideLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeckCardsInside: (deckId, front) => dispatch(actions.getDeckCardsInside(deckId, front)),
    onRemoveCard: (deckId, cardId) => dispatch(actions.removeCard(deckId, cardId)),
    onUpdateSearchString: (value) => dispatch(actions.updateCardsInsideSearchString(value)),
    onDeleteCard: (cardId) => dispatch(actions.deleteCard(cardId)),
    onFilterCardsInside: (filteredValue) => dispatch(actions.filterCardsInside(filteredValue)),
    onSetCardsInsideFilteredValue: (filteredValue) => dispatch(actions.setCardsInsideFilteredValue(filteredValue))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeckCardsInside));