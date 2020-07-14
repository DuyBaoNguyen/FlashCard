import * as actionTypes from './actionTypes';
import axios from '../../axios';
import history from '../../history';
import * as actions from './index';

const getUserDeckSuccess = (deck) => {
  return {
    type: actionTypes.GET_USER_DECK_SUCCESS,
    deck: deck
  };
};

const getUserDeckFail = () => {
  return {
    type: actionTypes.GET_USER_DECK_FAIL
  };
};

export const getUserDeck = (userId, deckId) => {
  return dispatch => {
    axios.get(`/api/admin/users/${userId}/decks/${deckId}`)
      .then(res => dispatch(getUserDeckSuccess(res.data)))
      .catch(() => dispatch(getUserDeckFail()));
  };
};

const getUserDeckCardsSuccess = (cards) => {
  return {
    type: actionTypes.GET_USER_DECK_CARDS_SUCCESS,
    cards: cards
  };
};

const getUserDeckCardsFail = () => {
  return {
    type: actionTypes.GET_USER_DECK_CARDS_FAIL
  };
};

export const getUserDeckCards = (userId, deckId) => {
  return dispatch => {
    axios.get(`/api/admin/users/${userId}/decks/${deckId}/cards`)
      .then(res => dispatch(getUserDeckCardsSuccess(res.data)))
      .catch(() => dispatch(getUserDeckCardsFail()));
  };
};

export const selectUserDeckCard = (cardId) => {
  return {
    type: actionTypes.SELECT_USER_DECK_CARD,
    cardId: cardId
  };
};

export const unselectUserDeckCard = () => {
  return {
    type: actionTypes.UNSELECT_USER_DECK_CARD
  };
};

export const resetStateInUserDeckDetailReducer = () => {
  return {
    type: actionTypes.RESET_STATE_IN_USER_DECK_DETAIL_REDUCER
  };
};

const deleteUserCardSuccess = (cardId) => {
  return {
    type: actionTypes.DELETE_USER_CARD_SUCCESS,
    cardId: cardId
  };
};

const deleteUserCardFail = () => {
  return {
    type: actionTypes.DELETE_USER_CARD_FAIL
  };
};

export const deleteUserCard = (userId, cardId) => {
  return dispatch => {
    axios.delete(`/api/admin/users/${userId}/cards/${cardId}`)
      .then(() => {
        dispatch(deleteUserCardSuccess(cardId));
        if (history.location.pathname.search(/^\/admin\/users\/[\da-zA-Z-]{36}\/decks\/\d+$/) > -1) {
          const segments = history.location.pathname.split('/');
          const deckId = segments[segments.length - 1];

          dispatch(getUserDeck(userId, deckId));
          dispatch(getUserDeckCards(userId, deckId));
        } else {
          dispatch(actions.checkToUnselectUserCard(cardId));
        }
        dispatch(actions.getCurrentUserCards(userId));
      })
      .catch(() => dispatch(deleteUserCardFail()));
  };
};

const deleteUserDeckFail = () => {
  return {
    type: actionTypes.DELETE_USER_DECK_FAIL
  };
};

export const deleteUserDeck = (userId, deckId) => {
  return dispatch => {
    axios.delete(`/api/admin/users/${userId}/decks/${deckId}`)
      .then(() => {
        dispatch(actions.getCurrentUserDecks(userId));
        history.push(history.location.state?.backUrl || '/');
      })
      .catch(() => dispatch(deleteUserDeckFail()));
  };
};
