import * as actionTypes from './actionTypes';
import axios from '../../axios';
import history from '../../history';

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

export const resetStateInCardsReducer = () => {
  return {
    type: actionTypes.RESET_STATE_IN_CARDS_REDUCER
  };
}

const deleteCardSuccess = (cardId) => {
  return {
    type: actionTypes.DELETE_CARD_SUCCESS,
    cardId: cardId
  };
};

const deleteCardFail = () => {
  return {
    type: actionTypes.DELETE_CARD_FAIL
  };
};

export const deleteCard = (cardId) => {
  return dispatch => {
    axios.delete(`/api/cards/${cardId}`)
      .then(() => {
        dispatch(deleteCardSuccess(cardId));
        if (history.location.pathname.search(/^\/cards\/\d+\/edit$/) > -1) {
          history.replace(history.location.state.backUrl || '/');
        } else {
          dispatch(getCards());
        }
      })
      .catch(() => dispatch(deleteCardFail()));
  };
};

export const setCardsFilteredValue = (filteredValue) => {
  return {
    type: actionTypes.SET_CARDS_FILTERED_VALUE,
    filteredValue: filteredValue
  };
};

export const filterCards = (filteredValue) => {
  return {
    type: actionTypes.FILTER_CARDS,
    filteredValue: filteredValue
  };
};
