import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';

const getCardsInDeckSuccess = (cardList) => {
  return {
    type: actionTypes.GET_CARDS_IN_DECK_SUCCESS,
    cardList: cardList
  };
};

const getCardsInDeckFail = () => {
  return {
    type: actionTypes.GET_CARDS_IN_DECK_FAIL
  };
};

export const getCardsInDeck = (id) => {
  console.log('ye');
  return dispatch => {
    axios.get(`/api/decks/${id}/cards`)
      .then(res => dispatch(getCardsInDeckSuccess(res.data)))
      .catch(err => dispatch(getCardsInDeckFail()));
  };
};