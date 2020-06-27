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
      .catch(() => dispatch(getCardFail()));
  };
};

export const clearUpdateFrontError = () => {
  return {
    type: actionTypes.CLEAR_UPDATE_FRONT_ERROR
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

export const toggleCardBackForm = (opened) => {
  return {
    type: actionTypes.TOGGLE_CARD_BACK_FORM,
    opened: opened
  };
};

const updateFrontSuccess = () => {
  return {
    type: actionTypes.UPDATE_FRONT_SUCCESS
  };
};

const updateFrontFail = (error) => {
  return {
    type: actionTypes.UPDATE_FRONT_FAIL,
    error: error
  };
};

export const updateFront = (cardId, front) => {
  return dispatch => {
    axios.put(`/api/cards/${cardId}`, { front })
      .then(() => {
        dispatch(updateFrontSuccess());
        dispatch(getCard(cardId));
      })
      .catch(err => {
        if (err.response.status === 400) {
          dispatch(updateFrontFail(err.response.data));
        }
      });
  };
};

export const selectBack = (backId) => {
  return {
    type: actionTypes.SELECT_BACK,
    backId: backId
  };
};

export const unselectBack = () => {
  return {
    type: actionTypes.UNSELECT_BACK
  };
};

const updateBackSuccess = () => {
  return {
    type: actionTypes.UPDATE_BACK_SUCCESS
  };
};

const updateBackFail = (error) => {
  return {
    type: actionTypes.UPDATE_BACK_FAIL,
    error: error
  };
};

export const updateBack = (cardId, backId, back) => {
  return dispatch => {
    axios.put(`/api/backs/${backId}`, {
      meaning: back.meaning,
      type: back.type,
      example: back.example
    }).then(() => {
      dispatch(updateBackSuccess());
      dispatch(getCard(cardId));
    }).catch(err => {
      if (err.response.status === 400) {
        dispatch(updateBackFail(err.response.data));
      }
    });
  };
};

const createBackSuccess = () => {
  return {
    type: actionTypes.CREATE_BACK_SUCCESS
  };
};

const createBackFail = (error) => {
  return {
    type: actionTypes.CREATE_BACK_FAIL,
    error: error
  };
};

export const createBack = (cardId, back) => {
  return dispatch => {
    var formData = new FormData();
    formData.append('meaning', back.meaning);
    formData.append('type', back.type);
    formData.append('example', back.example);
    formData.append('image', back.image);

    axios.post(`/api/cards/${cardId}/backs`, formData)
      .then(() => {
        dispatch(createBackSuccess());
        dispatch(getCard(cardId));
      })
      .catch(err => {
        if (err.response.status === 400) {
          dispatch(createBackFail(err.response.data));
        }
      });
  };
};

const deleteBackSuccess = () => {
  return {
    type: actionTypes.DELETE_BACK_SUCCESS
  };
};

const deleteBackFail = () => {
  return {
    type: actionTypes.DELETE_BACK_FAIL
  };
};

export const deleteBack = (cardId, backId) => {
  return dispatch => {
    axios.delete(`/api/backs/${backId}`)
      .then(() => {
        dispatch(deleteBackSuccess());
        dispatch(getCard(cardId));
      })
      .catch(() => dispatch(deleteBackFail()));
  };
};

const deleteImageSuccess = () => {
  return {
    type: actionTypes.DELETE_IMAGE_SUCCESS
  };
};

const deleteImageFail = () => {
  return {
    type: actionTypes.DELETE_IMAGE_FAIL
  };
};

export const deleteImage = (cardId, backId) => {
  return dispatch => {
    axios.put(`/api/backs/${backId}/image`)
      .then(() => {
        dispatch(deleteImageSuccess());
        dispatch(getCard(cardId));
      })
      .catch(() => dispatch(deleteImageFail()));
  };
};

const updateImageSuccess = () => {
  return {
    type: actionTypes.UPDATE_IMAGE_SUCCESS
  };
};

const updateImageFail = () => {
  return {
    type: actionTypes.UPDATE_IMAGE_FAIL
  };
};

export const updateImage = (cardId, backId, image) => {
  return dispatch => {
    const formData = new FormData();
    formData.append('image', image);

    axios.put(`/api/backs/${backId}/image`, formData)
      .then(() => {
        dispatch(updateImageSuccess());
        dispatch(getCard(cardId));
      })
      .catch(() => dispatch(updateImageFail()));
  };
};

export const clearUpdateBackError = () => {
  return {
    type: actionTypes.CLEAR_UPDATE_BACK_ERROR
  };
};