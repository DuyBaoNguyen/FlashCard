import * as actionTypes from '../actions/actionTypes';
import { transformStatistics } from '../../util/util';

const initialState = {
  deck: null,
  statistics: null,
  cards: [],
  selectedCard: null,
  errors: {
    getDeckError: false,
    getStatisticsError: false,
    getCardsError: false,
    deleteDeckError: false,
    updateDeckPublicStatusError: false,
    removeCardError: false
  }
};

export const deckDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DECK_SUCCESS:
      return {
        ...state,
        deck: action.deck,
        errors: {
          ...state.errors,
          getDeckError: false
        }
      };
    case actionTypes.GET_DECK_FAIL:
      return {
        ...state,
        deck: null,
        errors: {
          ...state.errors,
          getDeckError: true
        }
      };
    case actionTypes.GET_DECK_STATISTICS_SUCCESS:
      return {
        ...state,
        statistics: transformStatistics(action.statistics),
        errors: {
          ...state.errors,
          getStatisticsError: false
        }
      };
    case actionTypes.GET_DECK_STATISTICS_FAIL:
      return {
        ...state,
        statistics: null,
        errors: {
          ...state.errors,
          getStatisticsError: true
        }
      };
    case actionTypes.GET_DECK_CARDS_SUCCESS:
      return {
        ...state,
        cards: action.cards,
        errors: {
          ...state.errors,
          getCardsError: false
        }
      };
    case actionTypes.GET_DECK_CARDS_FAIL:
      return {
        ...state,
        cards: [],
        errors: {
          ...state.errors,
          getCardsError: true
        }
      };
    case actionTypes.DELETE_DECK_SUCCESS:
      return {
        ...state,
        deck: null,
        statistics: null,
        cards: [],
        selectedCard: null,
        errors: {
          ...state.errors,
          getDeckError: false,
          getStatisticsError: false,
          getCardsError: false,
          deleteDeckError: false,
          updateDeckPublicStatusError: false,
          removeCardError: false
        }
      };
    case actionTypes.DELETE_DECK_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          deleteDeckError: true
        }
      };
    case actionTypes.UPDATE_DECK_PUBLIC_STATUS_SUCCESS:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateDeckPublicStatusError: false
        }
      };
    case actionTypes.UPDATE_DECK_PUBLIC_STATUS_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateDeckPublicStatusError: true
        }
      };
    case actionTypes.SELECT_CARD_IN_DECK_DETAILS:
      return {
        ...state,
        selectedCard: state.cards.find(card => card.id === action.cardId)
      };
    case actionTypes.UNSELECT_CARD_IN_DECK_DETAILS:
      return {
        ...state,
        selectedCard: null
      };
    case actionTypes.REMOVE_CARD_SUCCESS:
      if (state.selectedCard && state.selectedCard.id === action.cardId) {
        return {
          ...state,
          selectedCard: null,
          errors: {
            ...state.errors,
            removeCardError: false
          }
        };
      }
      return state;
    case actionTypes.REMOVE_CARD_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          removeCardError: true
        }
      };
    default:
      return state;
  }
};
