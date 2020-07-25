import * as actionTypes from '../actions/actionTypes';

const initialState = {
  cardProposingFormOpen: false,
  proposeCardError: null
};

export const cardProposalReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PROPOSE_CARD_SUCCESS:
      return {
        ...state,
        proposeCardError: null,
      };
    case actionTypes.PROPOSE_CARD_FAIL:
      return {
        ...state,
        proposeCardError: action.error,
      };
    case actionTypes.CLEAR_PROPOSE_CARD_ERROR:
      return {
        ...state,
        proposeCardError: null
      };
    case actionTypes.TOGGLE_CARD_PROPOSING_FORM:
      return {
        ...state,
        cardProposingFormOpen: action.value
      };
    default:
      return state;
  }
};