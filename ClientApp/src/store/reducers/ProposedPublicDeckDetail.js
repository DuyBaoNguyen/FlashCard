import * as actionTypes from '../actions/actionTypes';

const initialState = {
  publicDeck: null,
  publicDeckCards: [],
  selectedCard: null,
  getPublicDeckCardsLoading: true,
  errors: {
    getPublicDeckError: false,
    getPublicDeckCardsError: false,
    approvePublicDeckError: false
  }
};

export const proposedPublicDeckDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PROPOSED_PUBLIC_DECK_SUCCESS:
      return {
        ...state,
        publicDeck: action.deck,
        errors: {
          ...state.errors,
          getPublicDeckError: false
        }
      };
    case actionTypes.GET_PROPOSED_PUBLIC_DECK_FAIL:
      return {
        ...state,
        publicDeck: null,
        errors: {
          ...state.errors,
          getPublicDeckError: true
        }
      };
    case actionTypes.GET_PROPOSED_PUBLIC_DECK_CARDS_SUCCESS:
      return {
        ...state,
        publicDeckCards: action.cards,
        getPublicDeckCardsLoading: false,
        errors: {
          ...state.errors,
          getPublicDeckCardsError: false
        }
      };
    case actionTypes.GET_PROPOSED_PUBLIC_DECK_CARDS_FAIL:
      return {
        ...state,
        publicDeckCards: [],
        getPublicDeckCardsLoading: false,
        errors: {
          ...state.errors,
          getPublicDeckCardsError: true
        }
      };
    case actionTypes.SELECT_PROPOSED_PUBLIC_DECK_CARD:
      return {
        ...state,
        selectedCard: state.publicDeckCards.find(card => card.id === action.cardId)
      };
    case actionTypes.UNSELECT_PROPOSED_PUBLIC_DECK_CARD:
      return {
        ...state,
        selectedCard: null
      };
    case actionTypes.APPROVE_PROPOSED_PUBLIC_DECK_SUCCESS:
      return {
        ...state,
        errors: {
          ...state.errors,
          approvePublicDeckError: false
        }
      };
    case actionTypes.APPROVE_PROPOSED_PUBLIC_DECK_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          approvePublicDeckError: true
        }
      };
    case actionTypes.RESET_STATE_IN_PROPOSED_PUBLIC_DECK_DETAIL_REDUCER:
      return initialState;
    default:
      return state;
  }
};