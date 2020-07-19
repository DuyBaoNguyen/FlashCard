import * as actionTypes from './actionTypes';
import axios from '../../axios';

const proposeCardSuccess = () => {
  return {
    type: actionTypes.PROPOSE_CARD_SUCCESS
  };
};

const proposeCardFail = (error) => {
  console.log(error);
  return {
    type: actionTypes.PROPOSE_CARD_FAIL,
    error: error
  };
};

export const proposeCard = (card) => {
  return dispatch => {
    const formData = new FormData();
    formData.append('front', card.front);
    formData.append('meaning', card.meaning);
    formData.append('type', card.type);
    formData.append('example', card.example);
    formData.append('image', card.image);

    axios.post(`/api/proposedcards`, formData)
      .then(() => {
        dispatch(proposeCardSuccess());
        dispatch(toggleCardProposingForm(false));
      })
      .catch(err => {
        if (err.response.status === 400) {
          dispatch(proposeCardFail(err.response.data));
        }
      });
  };
};

export const clearProposeCardError = () => {
  return {
    type: actionTypes.CLEAR_PROPOSE_CARD_ERROR
  };
};

export const toggleCardProposingForm = (value) => {
  return {
    type: actionTypes.TOGGLE_CARD_PROPOSING_FORM,
    value: value
  };
};