import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import Pagination from 'react-js-pagination';
import { withRouter } from 'react-router-dom';

import Card from '../../User/Card/Card';
import Confirm from '../../Shared/Confirm/Confirm';
import * as actions from '../../../store/actions';
import './UserCards.css';

const AMOUNT_CARDS = 12;

class UserCards extends Component {
  state = {
    activePage: 1,
    currentUserId: null,
    deletedCardId: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.currentUserId !== nextProps.currentUserId) {
			return {
				...prevState,
				activePage: 1,
				currentUserId: nextProps.currentUserId
			};
		}
		return null;
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
    const { onDeleteCard, currentUserId } = this.props;
    onDeleteCard(currentUserId, this.state.deletedCardId);
    this.setState({ deletedCardId: null });
  };

  handleOpenDeletingConfirm = (cardId) => {
    this.setState({ deletedCardId: cardId });
  }

  handleCloseDeletingConfirm = () => {
    this.setState({ deletedCardId: null });
  }

  render() {
    const { cards } = this.props;
    let { activePage, deletedCardId } = this.state;
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
              notSpeaker
              options={[{
                type: 'button',
                icon: <Icon icon={deleteIcon} color="red" />,
                label: { value: 'Delete card', color: 'red' },
                onClick: () => this.handleOpenDeletingConfirm(card.id)
              }]}
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
          onChange={this.handlePageChange}
          activeClass="pagination-item-active"
          itemClass="pagination-item"
        />
      );
    }
    return (
      <div className="user-cards-wrapper">
        <div className="cards">{cardsList}</div>
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
    cards: state.usersmanagement.currentUserCards,
    currentUserId: state.usersmanagement.currentUserId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDeleteCard: (userId, cardId) => dispatch(actions.deleteUserCard(userId, cardId)),
    onSelectCard: (cardId) => dispatch(actions.selectUserCard(cardId))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserCards));