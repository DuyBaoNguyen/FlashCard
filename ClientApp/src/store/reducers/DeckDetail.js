import * as actionTypes from '../actions/actionTypes';
import * as utils from '../../util/util';

const initialState = {
  deck: null,
  statistics: null,
  cards: [],
  originalCards: [],
  remainingCards: [],
  originalRemainingCards: [],
  filteredValues: {
    cardsFilteredValue: '',
    remainingCardsFilteredValue: ''
  },
  cardsInsideSearchString: '',
  cardsOutsideSearchString: '',
  selectedCard: null,
  loadings: {
    getCardsInsideLoading: true,
    getCardsOutsideLoading: true,
  },
  errors: {
    getDeckError: false,
    getStatisticsError: false,
    getCardsInsideError: false,
    getCardsOutsideError: false,
    deleteDeckError: false,
    updateDeckPublicStatusError: false,
    removeCardError: false,
    addCardError: false
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
        statistics: utils.transformStatistics(action.statistics),
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
    case actionTypes.DELETE_DECK_SUCCESS:
      return {
        ...state,
        deck: null,
        statistics: null,
        cards: [],
        remainingCards: [],
        selectedCard: null,
        cardsInsideSearchString: '',
        cardsOutsideSearchString: '',
        errors: {
          ...state.errors,
          getDeckError: false,
          getStatisticsError: false,
          deleteDeckError: false,
          updateDeckPublicStatusError: false,
          removeCardError: false,
          addCardError: false,
          getCardsInsideError: false,
          getCardsOutsideError: false
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
    case actionTypes.ADD_CARD_SUCCESS:
      return {
        ...state,
        errors: {
          ...state.errors,
          addCardError: false
        }
      };
    case actionTypes.ADD_CARD_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          addCardError: true
        }
      };
    case actionTypes.GET_DECK_CARDS_INSIDE_SUCCESS:
      return {
        ...state,
        cards: utils.filterCards(action.cards, state.filteredValues.cardsFilteredValue),
        originalCards: action.cards,
        loadings: {
          ...state.loadings,
          getCardsInsideLoading: false
        },
        errors: {
          ...state.errors,
          getCardsInsideError: false
        }
      };
    case actionTypes.GET_DECK_CARDS_INSIDE_FAIL:
      return {
        ...state,
        cards: [],
        originalCards: [],
        loadings: {
          ...state.loadings,
          getCardsInsideLoading: false
        },
        errors: {
          ...state.errors,
          getCardsInsideError: true
        }
      };
    case actionTypes.GET_DECK_CARDS_OUTSIDE_SUCCESS:
      return {
        ...state,
        remainingCards: utils.filterCards(action.cards, state.filteredValues.remainingCardsFilteredValue),
        originalRemainingCards: action.cards,
        loadings: {
          ...state.loadings,
          getCardsOutsideLoading: false
        },
        errors: {
          ...state.errors,
          getCardsOutsideError: false
        }
      };
    case actionTypes.GET_DECK_CARDS_OUTSIDE_FAIL:
      return {
        ...state,
        remainingCards: [],
        originalRemainingCards: [],
        loadings: {
          ...state.loadings,
          getCardsOutsideLoading: false
        },
        errors: {
          ...state.errors,
          getCardsOutsideError: true
        }
      };
    case actionTypes.SET_CARDS_INSIDE_FILTERED_VALUE:
      return {
        ...state,
        filteredValues: {
          ...state.filteredValues,
          cardsFilteredValue: action.filteredValue
        }
      };
    case actionTypes.FILTER_CARDS_INSIDE:
      return {
        ...state,
        cards: utils.filterCards(state.originalCards, action.filteredValue)
      };
    case actionTypes.SET_CARDS_OUTSIDE_FILTERED_VALUE:
      return {
        ...state,
        filteredValues: {
          ...state.filteredValues,
          remainingCardsFilteredValue: action.filteredValue
        }
      };
    case actionTypes.FILTER_CARDS_OUTSIDE:
      return {
        ...state,
        remainingCards: utils.filterCards(state.originalRemainingCards, action.filteredValue)
      };
    case actionTypes.UPDATE_CARDS_INSIDE_SEARCH_STRING:
      return {
        ...state,
        cardsInsideSearchString: action.value
      };
    case actionTypes.UPDATE_CARDS_OUTSIDE_SEARCH_STRING:
      return {
        ...state,
        cardsOutsideSearchString: action.value
      };
    case actionTypes.RESET_STATE_IN_DECK_DETAIL_REDUCER:
      return initialState;
    default:
      return state;
  }
};
