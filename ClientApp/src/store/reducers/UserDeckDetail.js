import * as actionTypes from '../actions/actionTypes';

const initialState = {
  deck: null,
  cards: [],
  selectedCard: null,
  getCardsLoading: true,
  errors: {
    getDeckError: false,
    getCardsError: false,
    deleteCardError: false,
    deleteDeckError: false
  }
};

export const userDeckDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_DECK_SUCCESS:
      return {
        ...state,
        deck: action.deck,
        errors: {
          ...state.errors,
          getDeckError: false
        }
      };
    case actionTypes.GET_USER_DECK_FAIL:
      return {
        ...state,
        deck: null,
        errors: {
          ...state.errors,
          getDeckError: true
        }
      };
    case actionTypes.GET_USER_DECK_CARDS_SUCCESS:
      return {
        ...state,
        cards: action.cards,
        getCardsLoading: false,
        errors: {
          ...state.errors,
          getCardsError: false
        }
      };
    case actionTypes.GET_USER_DECK_CARDS_FAIL:
      return {
        ...state,
        cards: [],
        getCardsLoading: false,
        errors: {
          ...state.errors,
          getCardsError: true
        }
      };
    case actionTypes.SELECT_USER_DECK_CARD:
      return {
        ...state,
        selectedCard: state.cards.find(card => card.id === action.cardId)
      };
    case actionTypes.UNSELECT_USER_DECK_CARD:
      return {
        ...state,
        selectedCard: null
      };
    case actionTypes.DELETE_USER_CARD_SUCCESS:
      return {
        ...state,
        selectedCard: state.selectedCard?.id === action.cardId ? null : state.selectedCard,
        errors: {
          ...state.errors,
          deleteCardError: false
        }
      };
    case actionTypes.DELETE_USER_CARD_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          deleteCardError: true
        }
      };
    case actionTypes.DELETE_USER_DECK_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          deleteDeckError: true
        }
      };
    case actionTypes.RESET_STATE_IN_USER_DECK_DETAIL_REDUCER:
      return initialState;
    default:
      return state;
  }
};