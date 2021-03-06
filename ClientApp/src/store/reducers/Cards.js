import * as actionTypes from '../actions/actionTypes';
import * as utils from '../../util/util';

const initialState = {
  cards: [],
  originalCards: [],
  selectedCard: null,
  loadings: {
    getCardsLoading: true
  },
  filteredValue: '',
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
        cards: utils.filterCards(action.cards, state.filteredValue),
        originalCards: action.cards,
        loadings: {
          ...state.loadings,
          getCardsLoading: false
        },
        errors: {
          ...state.errors,
          getCardsError: false
        }
      };
    case actionTypes.GET_CARDS_FAIL:
      return {
        ...state,
        cards: [],
        originalCards: [],
        loadings: {
          ...state.loadings,
          getCardsLoading: false
        },
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
    case actionTypes.CHECK_TO_UNSELECT_CARD_IN_CARDS:
      return {
        ...state,
        selectedCard: state.selectedCard?.id === action.cardId ? null : state.selectedCard
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
      return {
        ...initialState,
        cards: state.cards,
        loadings: state.loadings
      };
    case actionTypes.SET_CARDS_FILTERED_VALUE:
      return {
        ...state,
        filteredValue: action.filteredValue
      };
    case actionTypes.FILTER_CARDS:
      return {
        ...state,
        cards: utils.filterCards(state.originalCards, action.filteredValue)
      };
    default:
      return state;
  }
};