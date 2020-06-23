import * as actionTypes from './actionTypes';
import axios from '../../axios';
import history from '../../history';

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
        dispatch(toggleCardFrontForm());
        setTimeout(() => {
          history.push({
            pathname: `/cards/${res.data.id}/edit`,
            state: history.location.state
          });
        }, 100);
      })
      .catch(err => {
        if (err.response.status === 400) {
          dispatch(createCardFail(err.response.data));
        }
      });
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
      .catch(err => {
        if (err.response.status !== 404) {
          dispatch(getCardFail());
        }
      });
  };
};

export const clearUpdateCardError = () => {
  return {
    type: actionTypes.CLEAR_UPDATE_CARD_ERROR
  };
};

export const resetStateInCardReducer = () => {
  return {
    type: actionTypes.RESET_STATE_IN_CARD_REDUCER
  };
};

export const toggleCardFrontForm = (opened) => {
  return {
    type: actionTypes.TOGGLE_CARD_FRONT_FORM,
    opened: opened
  };
};

const updateCardSuccess = () => {
  return {
    type: actionTypes.UPDATE_CARD_SUCCESS
  };
};

const updateCardFail = (error) => {
  return {
    type: actionTypes.UPDATE_CARD_FAIL,
    error: error
  };
};

export const updateCard = (cardId, front) => {
  return dispatch => {
    axios.put(`/api/cards/${cardId}`, { front })
      .then(() => {
        dispatch(updateCardSuccess());
        dispatch(getCard(cardId));
      })
      .catch(err => {
        if (err.response.status === 400) {
          dispatch(updateCardFail(err.response.data));
        }
      })
  };
};
