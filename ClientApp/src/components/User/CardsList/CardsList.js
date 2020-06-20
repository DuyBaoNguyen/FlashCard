import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import Pagination from 'react-js-pagination';

import Search from '../../Shared/Search/Search';
import Button from '../../Shared/Button/Button';
import Card from '../Card/Card';
import Loading from '../../Shared/Loading/Loading';
import * as actions from '../../../store/actions';
import './CardsList.css';

const AMOUNT_CARDS = 12;

class CardsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1
    };
  }

  componentDidMount() {
    this.props.onGetCards();
  }

  componentWillUnmount() {
    this.props.onUpdateSearchString('');
    this.props.onUnselectCard();
    this.props.onResetLoading();
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
    this.props.onGetCards(searchString);
    this.setState({ activePage: 1 });
  }

  handleDeleteCard = (cardId) => {
    this.props.onDeleteCard(cardId);
  }

  render() {
    const { cards, loading } = this.props;
    const { activePage } = this.state;
    let cardsList = loading ? <Loading /> : <p className="text-notify">There are no cards here!</p>;
    let pagination;

    if (cards.length > 0 && !loading) {
      const options = [
        {
          type: 'link',

        }
      ];
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
                  onClick={this.handleClickCard} />
              );
            })}
        </div>
      );

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
      <div className="cards-list-wrapper">
        <div className="cards-list-header">
          <p>My cards</p>
          <div className="cards-list-header-features">
            <Button
              type="link"
              path={`/cards/create`}
              className="cards-list-header-features-add"
              icon={<Icon icon={plusIcon} />} >
            </Button>
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
    cards: state.cards.cards,
    loading: state.cards.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCards: (front) => dispatch(actions.getCards(front)),
    onSelectCard: (id) => dispatch(actions.selectCardInCards(id)),
    onUnselectCard: () => dispatch(actions.unselectCardInCards()),
    onUpdateSearchString: (value) => dispatch(actions.updateCardsSearchString(value)),
    onResetLoading: () => dispatch(actions.resetGetCardsLoading()),
    onDeleteCard: (cardId) => dispatch(actions.deleteCard(cardId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardsList);