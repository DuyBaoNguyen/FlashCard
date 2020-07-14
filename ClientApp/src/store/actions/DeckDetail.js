import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';
import history from '../../history';

const getDeckSuccess = (deck) => {
  return {
    type: actionTypes.GET_DECK_SUCCESS,
    deck: deck
  };
};

const getDeckFail = () => {
  return {
    type: actionTypes.GET_DECK_FAIL
  };
};

export const getDeck = (id) => {
  return dispatch => {
    axios.get(`/api/decks/${id}`)
      .then(res => dispatch(getDeckSuccess(res.data)))
      .catch(err => dispatch(getDeckFail()));
  };
};

const getDeckStatisticsSuccess = (statistics) => {
  return {
    type: actionTypes.GET_DECK_STATISTICS_SUCCESS,
    statistics: statistics
  }
};

const getDeckStatisticsFail = () => {
  return {
    type: actionTypes.GET_DECK_STATISTICS_FAIL
  };
};

export const getDeckStatistics = (id) => {
  return dispatch => {
    axios.get(`/api/decks/${id}/statistics/test`)
      .then(res => dispatch(getDeckStatisticsSuccess(res.data)))
      .catch(err => dispatch(getDeckStatisticsFail()));
  };
};

const deleteDeckSuccess = () => {
  return {
    type: actionTypes.DELETE_DECK_SUCCESS
  };
};

const deleteDeckFail = () => {
  return {
    type: actionTypes.DELETE_DECK_FAIL
  };
};

export const deleteDeck = (id) => {
  return dispatch => {
    axios.delete(`/api/decks/${id}`)
      .then(() => {
        dispatch(deleteDeckSuccess());
        history.push('/');
      })
      .catch(err => dispatch(deleteDeckFail()));
  };
};

const updateDeckPublicStatusSuccess = () => {
  return {
    type: actionTypes.UPDATE_DECK_PUBLIC_STATUS_SUCCESS
  };
};

const updateDeckPublicStatusFail = () => {
  return {
    type: actionTypes.UPDATE_DECK_PUBLIC_STATUS_FAIL
  };
};

export const updateDeckPublicStatus = (id, value) => {
  return dispatch => {
    axios.put(`/api/decks/${id}/public`, { value })
      .then(() => {
        dispatch(getDeck(id));
        dispatch(updateDeckPublicStatusSuccess());
      })
      .catch(err => dispatch(updateDeckPublicStatusFail()));
  };
};

export const selectCardInDeckDetails = (cardId) => {
  return {
    type: actionTypes.SELECT_CARD_IN_DECK_DETAILS,
    cardId: cardId
  };
}

export const unselectCardInDeckDetails = () => {
  return {
    type: actionTypes.UNSELECT_CARD_IN_DECK_DETAILS
  };
}

export const checkToUnselectCardInDeckDetails = (cardId) => {
  return {
    type: actionTypes.CHECK_TO_UNSELECT_CARD_IN_DECK_DETAILS,
    cardId: cardId
  };
}

const removeCardSuccess = (cardId) => {
  return {
    type: actionTypes.REMOVE_CARD_SUCCESS,
    cardId: cardId
  };
};

const removeCardFail = () => {
  return {
    type: actionTypes.REMOVE_CARD_FAIL
  };
};

export const removeCard = (deckId, cardId) => {
  return dispatch => {
    axios.delete(`/api/decks/${deckId}/cards/${cardId}`)
      .then(res => {
        if (history.location.pathname.search(/^\/decks\/\d+$/) > -1) {
          dispatch(getDeck(deckId));
          dispatch(getDeckStatistics(deckId));
        } else {
          dispatch(getDeckCardsOutside(deckId));
        }
        dispatch(removeCardSuccess(cardId));
        dispatch(getDeckCardsInside(deckId));
      })
      .catch(err => dispatch(removeCardFail()));
  };
};

const addCardSuccess = () => {
  return {
    type: actionTypes.ADD_CARD_SUCCESS
  };
};

const addCardFail = () => {
  return {
    type: actionTypes.ADD_CARD_FAIL
  };
};

export const addCard = (deckId, cardId) => {
  return dispatch => {
    axios.put(`/api/decks/${deckId}/cards/${cardId}`)
      .then(res => {
        dispatch(addCardSuccess());
        dispatch(getDeckCardsInside(deckId));
        dispatch(getDeckCardsOutside(deckId));
      })
      .catch(err => dispatch(addCardFail()));
  };
};

const getDeckCardsInsidesSuccess = (cards) => {
  return {
    type: actionTypes.GET_DECK_CARDS_INSIDE_SUCCESS,
    cards: cards
  };
};

const getDeckCardsInsidesFail = () => {
  return {
    type: actionTypes.GET_DECK_CARDS_INSIDE_FAIL
  };
};

export const getDeckCardsInside = (deckId, front) => {
  return (dispatch, getState) => {
    const { cardsInsideSearchString } = getState().deckDetail;
    axios.get(`/api/decks/${deckId}/cards?front=${front || cardsInsideSearchString}`)
      .then(res => dispatch(getDeckCardsInsidesSuccess(res.data)))
      .catch(err => dispatch(getDeckCardsInsidesFail()));
  };
};

const getDeckCardsOutsidesSuccess = (cards) => {
  return {
    type: actionTypes.GET_DECK_CARDS_OUTSIDE_SUCCESS,
    cards: cards
  };
};

const getDeckCardsOutsidesFail = () => {
  return {
    type: actionTypes.GET_DECK_CARDS_OUTSIDE_FAIL
  };
};

export const setCardsInsideFilteredValue = (filteredValue) => {
  return {
    type: actionTypes.SET_CARDS_INSIDE_FILTERED_VALUE,
    filteredValue: filteredValue
  };
};

export const filterCardsInside = (filteredValue) => {
  return {
    type: actionTypes.FILTER_CARDS_INSIDE,
    filteredValue: filteredValue
  };
};

export const setCardsOutsideFilteredValue = (filteredValue) => {
  return {
    type: actionTypes.SET_CARDS_OUTSIDE_FILTERED_VALUE,
    filteredValue: filteredValue
  };
};

export const filterCardsOutside = (filteredValue) => {
  return {
    type: actionTypes.FILTER_CARDS_OUTSIDE,
    filteredValue: filteredValue
  };
};

export const getDeckCardsOutside = (deckId, front) => {
  return (dispatch, getState) => {
    const { cardsOutsideSearchString } = getState().deckDetail;
    axios.get(`/api/decks/${deckId}/remainingcards?front=${front || cardsOutsideSearchString}`)
      .then(res => dispatch(getDeckCardsOutsidesSuccess(res.data)))
      .catch(err => dispatch(getDeckCardsOutsidesFail()));
  };
};

export const updateCardsInsideSearchString = (value) => {
  return {
    type: actionTypes.UPDATE_CARDS_INSIDE_SEARCH_STRING,
    value: value
  };
}

export const updateCardsOutsideSearchString = (value) => {
  return {
    type: actionTypes.UPDATE_CARDS_OUTSIDE_SEARCH_STRING,
    value: value
  };
}

export const resetStateInDeckDetailReducer = () => {
  return {
    type: actionTypes.RESET_STATE_IN_DECK_DETAIL_REDUCER
  };
};

export const setPracticeOptionsOpen = (value) => {
  return {
    type: actionTypes.SET_PRACTICE_OPTIONS_OPEN,
    value: value
  };
};