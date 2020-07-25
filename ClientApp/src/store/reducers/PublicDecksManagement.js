import * as actionTypes from '../actions/actionTypes';

const initialState = {
  publicDecks: [],
  getPublicDecksLoading: true,
  getPublicDecksError: false
};

export const publicDecksManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PROPOSED_PUBLIC_DECKS_SUCCESS:
      return {
        ...state,
        publicDecks: action.decks,
        getPublicDecksLoading: false,
        getPublicDecksError: false
      };
    case actionTypes.GET_PROPOSED_PUBLIC_DECKS_FAIL:
      return {
        ...state,
        publicDecks: [],
        getPublicDecksLoading: false,
        getPublicDecksError: true
      };
    default:
      return state;
  }
};