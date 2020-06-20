import * as actionTypes from '../actions/actionTypes';

const initialState = {
  cards: [],
  selectedCard: null,
  loading: true,
  searchString: '',
  errors: {
    getCardsError: false,
    deleteCardError: false
  }
};

export const cardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_CARDS_SUCCESS:
      return {
        ...state,
        cards: action.cards,
        loading: false,
        errors: {
          ...state.errors,
          getCardsError: false
        }
      };
    case actionTypes.GET_CARDS_FAIL:
      return {
        ...state,
        cards: [],
        loading: false,
        errors: {
          ...state.errors,
          getCardsError: true
        }
      };
    case actionTypes.UPDATE_CARDS_SEARCH_STRING:
      return {
        ...state,
        searchString: action.value
      };
    case actionTypes.SELECT_CARD_IN_CARDS:
      return {
        ...state,
        selectedCard: state.cards.find(card => card.id === action.cardId)
      };
    case actionTypes.DELETE_CARD_SUCCESS:
      const newState = {
        ...state,
        errors: {
          ...state.errors,
          deleteCardError: false
        }
      };
      if (state.selectedCard && action.cardId === state.selectedCard.id) {
        newState.selectedCard = null;
      }
      return newState;
    case actionTypes.DELETE_CARD_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          deleteCardError: true
        }
      };
    case actionTypes.RESET_STATE_IN_CARDS_REDUCER:
      return initialState;
    default:
      return state;
  }
};