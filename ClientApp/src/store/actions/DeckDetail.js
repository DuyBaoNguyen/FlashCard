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

const getDeckCardsSuccess = (cards) => {
  return {
    type: actionTypes.GET_DECK_CARDS_SUCCESS,
    cards: cards
  };
};

const getDeckCardsFail = () => {
  return {
    type: actionTypes.GET_DECK_CARDS_FAIL
  };
};

export const getDeckCards = (id, front) => {
  return dispatch => {
    axios.get(`/api/decks/${id}/cards?front=${front}`)
      .then(res => dispatch(getDeckCardsSuccess(res.data)))
      .catch(err => dispatch(getDeckCardsFail()));
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