import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Transition from 'react-transition-group/Transition'
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify/icons-uil/multiply';
import arrowLeftIcon from '@iconify/icons-uil/angle-left';

import BackDrop from '../../Shared/BackDrop/BackDrop';
import OptionButton from '../../Shared/OptionButton/OptionButton';
import Card from '../Card/Card';
import Pagination from 'react-js-pagination';
import Button from '../../Shared/Button/Button';
import * as actions from '../../../store/actions';
import { PracticeMode } from '../../../applicationConstants';
import './PracticeOptions.css';

const animationDuration = {
  enter: 200,
  exit: 200
};
const AMOUNT_CARDS = 18;

class PracticeOptions extends Component {
  state = {
    customMode: false,
    activePage: 1,
    selectedCards: []
  }

  componentWillUnmount() {
    this.props.onClose();
  }

  handleClickAllCardsOption = () => {
    if (this.props.cards.length > 0) {
      this.props.history.push({
        pathname: `/decks/testing/${this.props.deck.id}`,
        state: { practiceMode: PracticeMode.AllCards }
      });
    }
  }

  handleClickNotRememberedCardsOption = () => {
    if (this.props.cards.some(card => !card.remembered)) {
      this.props.history.push({
        pathname: `/decks/testing/${this.props.deck.id}`,
        state: { practiceMode: PracticeMode.NotRememberedCards }
      });
    }
  }

  handleClickCustomOptionPractice = () => {
    if (this.state.selectedCards.length > 0) {
      this.props.history.push({
        pathname: `/decks/testing/${this.props.deck.id}`,
        state: { practiceMode: PracticeMode.Custom }
      });
      this.props.onSetPracticedCards(this.state.selectedCards);
    }
  }

  handleClickCustomOption = () => {
    this.setState({ customMode: true });
  }

  handleBackToOptions = () => {
    this.setState({
      customMode: false,
      selectedCards: []
    });
  }

  handleClickCard = (cardId) => {
    const updatedSelectedState = [...this.state.selectedCards];
    const index = this.state.selectedCards.findIndex(card => card.id === cardId);

    if (index > -1) {
      updatedSelectedState.splice(index, 1);
    } else {
      updatedSelectedState.push(this.props.cards.find(card => card.id === cardId));
    }

    this.setState({ selectedCards: updatedSelectedState });
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  handleClose = () => {
    this.props.onClose();
    setTimeout(() => {
      this.setState({ customMode: false });
    }, 100);
  }

  render() {
    const { cards, isOpen } = this.props;
    const { customMode, activePage, selectedCards } = this.state;

    let cardsList = <p className="text-notify">There are no cards here!</p>;
    let pagination;

    if (cards.length > 0) {
      cardsList = (
        <div className="cards">
          {cards.filter((card, index) => index >= (activePage - 1) * AMOUNT_CARDS && index <= activePage * AMOUNT_CARDS - 1)
            .map(card => {
              return (
                <Card
                  key={card.id}
                  displayStatus
                  card={card}
                  notFliped
                  notSpeaker
                  selected={selectedCards.some(c => c.id === card.id)}
                  onClick={this.handleClickCard} />
              );
            })}
        </div>
      )

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
      <div className="practice-options">
        <BackDrop isOpen={isOpen} onClick={this.handleClose} />
        <Transition
          mountOnEnter
          unmountOnExit
          in={isOpen}
          timeout={animationDuration}>
          {state => {
            const practiceOptionsClasses = [
              'practice-options-wrapper',
              customMode ? 'expand' : null,
              state === 'entering' ? 'practice-options-open' : (state === 'exiting' ? 'practice-options-close' : null)
            ];

            return (
              <div className={practiceOptionsClasses.join(' ')}>
                {!customMode
                  ? (
                    <>
                      <span className="close-btn" onClick={this.handleClose}>
                        <Icon icon={closeIcon} style={{ fontSize: 16 }} />
                      </span>
                      <div className="practice-options-header">
                        Choose practice mode
                      </div>
                      <div className="practice-options-features">
                        <OptionButton
                          type="button"
                          onClick={this.handleClickAllCardsOption}>
                          All Cards
                        </OptionButton>
                        <OptionButton
                          type="button"
                          onClick={this.handleClickNotRememberedCardsOption}>
                          Not Remembered Cards
                        </OptionButton>
                        <OptionButton
                          type="button"
                          onClick={this.handleClickCustomOption}>
                          Custom
                        </OptionButton>
                      </div>
                    </>
                  )
                  : (
                    <>
                      <div className="back-feature">
                        <span className="back-feature-wrapper" onClick={this.handleBackToOptions}>
                          <span className="back-feature-icon">
                            <Icon icon={arrowLeftIcon} />
                          </span>
                          <span className="back-feature-label"> Back</span>
                        </span>
                      </div>
                      <Button
                        type="button"
                        className="practice-btn"
                        onClick={this.handleClickCustomOptionPractice}>
                        Practice
                      </Button>
                      {cardsList}
                      <div className="cards-pagination">{pagination}</div>
                    </>
                  )
                }
              </div>
            );
          }}
        </Transition>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetPracticedCards: (cards) => dispatch(actions.getCardsInDeckSuccess(cards)),
    onSetPracticeOptionsOpen: (value) => dispatch(actions.setPracticeOptionsOpen(value))
  };
};

export default connect(null, mapDispatchToProps)(withRouter(PracticeOptions));