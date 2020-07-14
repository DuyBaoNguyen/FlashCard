import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import Pagination from 'react-js-pagination';
import { withRouter } from 'react-router-dom';

import Card from '../../User/Card/Card';
import Loading from '../../Shared/Loading/Loading';
import Confirm from '../../Shared/Confirm/Confirm';
import * as actions from '../../../store/actions';
import { TIME_OUT_DURATION } from '../../../applicationConstants';
import './UserDeckCards.css';

const AMOUNT_CARDS = 12;

class UserDeckCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      setLoading: false,
      deletedCardId: null
    };
  }

  componentDidMount() {
    const { match, onGetUserDeckCards, loading } = this.props;
    const { setLoading } = this.state;

    onGetUserDeckCards(match.params.userId, match.params.deckId);

    if (!setLoading && !this.timeoutNumber) {
      setTimeout(() => {
        if (loading) {
          this.setState({ setLoading: true });
        }
      }, TIME_OUT_DURATION);
    }
  }

  componentDidUpdate() {
    const { cards } = this.props;
    const { activePage } = this.state;

    if (activePage > 1 && cards.length < (activePage - 1) * AMOUNT_CARDS + 1) {
      this.setState(state => {
        return { activePage: state.activePage - 1 };
      });
    }
  }

  handleClickCard = (cardId) => {
    this.props.onSelectCard(cardId);
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  handleDeleteCard = () => {
    const { match, onDeleteCard } = this.props;
    onDeleteCard(match.params.userId, this.state.deletedCardId);
    this.setState({ deletedCardId: null });
  };

  handleOpenDeletingConfirm = (cardId) => {
    this.setState({ deletedCardId: cardId });
  }

  handleCloseDeletingConfirm = () => {
    this.setState({ deletedCardId: null });
  }

  render() {
    const { cards, loading } = this.props;
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
                  notSpeaker
                  options={[{
                    type: 'button',
                    icon: <Icon icon={deleteIcon} color="red" />,
                    label: { value: 'Delete card', color: 'red' },
                    onClick: () => this.handleOpenDeletingConfirm(card.id)
                  }]}
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
          onChange={this.handlePageChange}
          activeClass="pagination-item-active"
          itemClass="pagination-item"
        />
      );
    }
    return (
      <div className="user-deck-cards-wrapper">
        <div className="user-deck-cards-header">
          <p>Cards in deck</p>
        </div>
        {cardsList}
        <div className="cards-pagination">{pagination}</div>
        <Confirm
          isOpen={!!deletedCardId}
          header="Delete"
          message="Are you sure you want to delete this card?"
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
    cards: state.userDeckDetail.cards,
    loading: state.userDeckDetail.getCardsLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetUserDeckCards: (userId, deckId) => dispatch(actions.getUserDeckCards(userId, deckId)),
    onSelectCard: (cardId) => dispatch(actions.selectUserDeckCard(cardId)),
    onDeleteCard: (userId, deckId, cardId) => dispatch(actions.deleteUserCard(userId, deckId, cardId))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserDeckCards));