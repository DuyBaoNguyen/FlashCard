import * as actionTypes from './actionTypes';
import axios from '../../axios';
import history from '../../history';

const getPublicDeckSuccess = (deck) => {
  return {
    type: actionTypes.GET_PUBLIC_DECK_SUCCESS,
    deck: deck
  };
};

const getPublicDeckFail = () => {
  return {
    type: actionTypes.GET_PUBLIC_DECK_FAIL
  };
};

export const getPublicDeck = (deckId) => {
  return dispatch => {
    const segmentUrl = history.location.pathname.search(/^\/publicdecks\/\d+$/) > -1 ? 'publicdecks' : 'userpublicdecks';
    axios.get(`/api/${segmentUrl}/${deckId}`)
      .then(res => dispatch(getPublicDeckSuccess(res.data)))
      .catch(() => dispatch(getPublicDeckFail()));
  };
};

const getPublicDeckCardsSuccess = (cards) => {
  return {
    type: actionTypes.GET_PUBLIC_DECK_CARDS_SUCCESS,
    cards: cards
  };
};

const getPublicDeckCardsFail = () => {
  return {
    type: actionTypes.GET_PUBLIC_DECK_CARDS_FAIL
  };
};

export const getPublicDeckCards = (deckId, front) => {
  return (dispatch, getState) => {
    const { cardsSearchString: searchString } = getState().publicDeckDetail;
    axios.get(`/api/decks/${deckId}/cards?front=${front || searchString}`)
      .then(res => dispatch(getPublicDeckCardsSuccess(res.data)))
      .catch(() => dispatch(getPublicDeckCardsFail()));
  };
};

export const selectPublicDeckCard = (cardId) => {
  return {
    type: actionTypes.SELECT_PUBLIC_DECK_CARD,
    cardId: cardId
  };
};

export const unselectPublicDeckCard = () => {
  return {
    type: actionTypes.UNSELECT_PUBLIC_DECK_CARD
  };
};

export const resetStateInPublicDeckDetailReducer = () => {
  return {
    type: actionTypes.RESET_STATE_IN_PUBLIC_DECK_DETAIL_REDUCER
  };
};

export const updatePublicDeckCardsSearchString = (value) => {
  return {
    type: actionTypes.UPDATE_PUBLIC_DECK_CARDS_SEARCH_STRING,
    value: value
  };
};

export const setPublicDeckCardsFilteredValue = (value) => {
  return {
    type: actionTypes.SET_PUBLIC_DECK_CARDS_FILTERED_VALUE,
    value: value
  };
};

export const filterPublicDeckCards = (filteredValue) => {
  return {
    type: actionTypes.FILTER_PUBLIC_DECK_CARDS,
    filteredValue: filteredValue
  };
};