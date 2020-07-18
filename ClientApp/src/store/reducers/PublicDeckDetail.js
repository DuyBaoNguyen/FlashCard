import * as actionTypes from '../actions/actionTypes';
import * as utils from '../../util/util';

const initialState = {
  deck: null,
  cards: [],
  originalCards: [],
  selectedCard: null,
  getCardsLoading: true,
  cardsSearchString: '',
  cardsFilteredValue: '',
  errors: {
    getDeckError: false,
    getCardsError: false
  }
};

export const publicDeckDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PUBLIC_DECK_SUCCESS:
      return {
        ...state,
        deck: action.deck,
        errors: {
          ...state.errors,
          getDeckError: false
        }
      };
    case actionTypes.GET_PUBLIC_DECK_FAIL:
      return {
        ...state,
        deck: null,
        errors: {
          ...state.errors,
          getDeckError: true
        }
      };
    case actionTypes.GET_PUBLIC_DECK_CARDS_SUCCESS:
      return {
        ...state,
        originalCards: action.cards,
        cards: utils.filterCards(action.cards, state.cardsFilteredValue),
        getCardsLoading: false,
        errors: {
          ...state.errors,
          getCardsError: false
        }
      };
    case actionTypes.GET_PUBLIC_DECK_CARDS_FAIL:
      return {
        ...state,
        originalCards: [],
        cards: [],
        getCardsLoading: false,
        errors: {
          ...state.errors,
          getCardsError: true
        }
      };
    case actionTypes.SELECT_PUBLIC_DECK_CARD:
      return {
        ...state,
        selectedCard: state.cards.find(card => card.id === action.cardId)
      };
    case actionTypes.UNSELECT_PUBLIC_DECK_CARD:
      return {
        ...state,
        selectedCard: null
      };
    case actionTypes.UPDATE_PUBLIC_DECK_CARDS_SEARCH_STRING:
      return {
        ...state,
        cardsSearchString: action.value
      };
    case actionTypes.SET_PUBLIC_DECK_CARDS_FILTERED_VALUE:
      return {
        ...state,
        cardsFilteredValue: action.value
      };
    case actionTypes.FILTER_PUBLIC_DECK_CARDS:
      return {
        ...state,
        cards: utils.filterCards(state.originalCards, action.filteredValue)
      };
    case actionTypes.RESET_STATE_IN_PUBLIC_DECK_DETAIL_REDUCER:
      return initialState;
    default:
      return state;
  }
};