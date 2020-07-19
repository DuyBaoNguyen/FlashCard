import * as actionTypes from './actionTypes';
import axios from '../../axios';

const getProposedPublicDecksSuccess = (decks) => {
  return {
    type: actionTypes.GET_PROPOSED_PUBLIC_DECKS_SUCCESS,
    decks: decks
  };
};

const getProposedPublicDecksFail = () => {
  return {
    type: actionTypes.GET_PROPOSED_PUBLIC_DECKS_FAIL
  };
};

export const getProposedPublicDecks = () => {
  return dispatch => {
    axios.get('/api/admin/publicdecks')
      .then(res => dispatch(getProposedPublicDecksSuccess(res.data)))
      .catch(() => dispatch(getProposedPublicDecksFail()));
  };
};