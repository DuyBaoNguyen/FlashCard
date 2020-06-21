import * as actionTypes from './actionTypes';
import axios from '../../axios';
import history from '../../history';

const createCardSuccess = () => {
  return {
    type: actionTypes.CREATE_CARD_SUCCESS
  };
};

const createCardFail = (error) => {
  return {
    type: actionTypes.CREATE_CARD_FAIL,
    error: error
  };
};

export const createCard = (front) => {
  return dispatch => {
    axios.post(`/api/cards`, { front })
      .then(res => {
        dispatch(createCardSuccess());
        history.push({
          pathname: `/cards/${res.data.id}/edit`,
          state: history.location.state
        });
      })
      .catch(err => dispatch(createCardFail(err.response.data)));
  };
};

const getCardSuccess = (card) => {
  return {
    type: actionTypes.GET_CARD_SUCCESS,
    card: card
  };
};

const getCardFail = () => {
  return {
    type: actionTypes.GET_CARD_FAIL
  };
};

export const getCard = (cardId) => {
  return dispatch => {
    axios.get(`/api/cards/${cardId}`)
      .then(res => dispatch(getCardSuccess(res.data)))
      .catch(() => dispatch(getCardFail()));
  };
};