import * as actionTypes from './actionTypes';
import axios from '../../axios';
import history from '../../history';

const getProposedPublicDeckSuccess = (deck) => {
  return {
    type: actionTypes.GET_PROPOSED_PUBLIC_DECK_SUCCESS,
    deck: deck
  };
};

const getProposedPublicDeckFail = () => {
  return {
    type: actionTypes.GET_PROPOSED_PUBLIC_DECK_FAIL
  };
};

export const getProposedPublicDeck = (deckId) => {
  return dispatch => {
    axios.get(`/api/admin/publicdecks/${deckId}`)
      .then(res => dispatch(getProposedPublicDeckSuccess(res.data)))
      .catch(() => dispatch(getProposedPublicDeckFail()));
  };
};

const getProposedPublicDeckCardsSuccess = (cards) => {
  return {
    type: actionTypes.GET_PROPOSED_PUBLIC_DECK_CARDS_SUCCESS,
    cards: cards
  };
};

const getProposedPublicDeckCardsFail = () => {
  return {
    type: actionTypes.GET_PROPOSED_PUBLIC_DECK_CARDS_FAIL
  };
};

export const getProposedPublicDeckCards = (deckId) => {
  return dispatch => {
    axios.get(`/api/admin/publicdecks/${deckId}/cards`)
      .then(res => dispatch(getProposedPublicDeckCardsSuccess(res.data)))
      .catch(() => dispatch(getProposedPublicDeckCardsFail()));
  };
};

export const resetStateInProposedPublicDeckDetailReducer = () => {
  return {
    type: actionTypes.RESET_STATE_IN_PROPOSED_PUBLIC_DECK_DETAIL_REDUCER
  };
};

export const selectProposedPublicDeckCard = (cardId) => {
  return {
    type: actionTypes.SELECT_PROPOSED_PUBLIC_DECK_CARD,
    cardId: cardId
  };
};

export const unselectProposedPublicDeckCard = () => {
  return {
    type: actionTypes.UNSELECT_PROPOSED_PUBLIC_DECK_CARD,
  };
};

const approveProposedPublicDeckSuccess = () => {
  return {
    type: actionTypes.APPROVE_PROPOSED_PUBLIC_DECK_SUCCESS
  };
};

const approveProposedPublicDeckFail = () => {
  return {
    type: actionTypes.APPROVE_PROPOSED_PUBLIC_DECK_FAIL
  };
};

export const approveProposedPublicDeck = (deckId, value) => {
  return dispatch => {
    axios.put(`/api/admin/publicdecks/${deckId}/approved`, { value })
      .then(() => {
        history.push(history.location.state?.backUrl || '/');
        dispatch(approveProposedPublicDeckSuccess());
      })
      .catch(() => dispatch(approveProposedPublicDeckFail()));
  };
}