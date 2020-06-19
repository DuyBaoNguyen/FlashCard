import * as actionTypes from './actionTypes';
import axios from '../../axios';

const getCardsSuccess = (cards) => {
  return {
    type: actionTypes.GET_CARDS_SUCCESS,
    cards: cards
  };
};

const getCardsFail = () => {
  return {
    type: actionTypes.GET_CARDS_FAIL
  };
};

export const getCards = (front) => {
  return (dispatch, getState) => {
    const { searchString } = getState().cards;
    axios.get(`/api/cards?front=${front || searchString}`)
      .then(res => dispatch(getCardsSuccess(res.data)))
      .catch(error => dispatch(getCardsFail()));
  };
};

export const updateCardsSearchString = (value) => {
  return {
    type: actionTypes.UPDATE_CARDS_SEARCH_STRING,
    value: value
  };
};

export const selectCardInCards = (cardId) => {
  return {
    type: actionTypes.SELECT_CARD_IN_CARDS,
    cardId: cardId
  };
};

export const unselectCardInCards = () => {
  return {
    type: actionTypes.UNSELECT_CARD_IN_CARDS
  };
};

export const resetGetCardsLoading = () => {
  return {
    type: actionTypes.RESET_GET_CARDS_LOADING
  };
}