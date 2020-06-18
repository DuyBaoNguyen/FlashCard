import * as actionTypes from '../actions/actionTypes';

const initialState = {
  cards: [],
  selectedCard: null,
  loading: true,
  searchString: '',
  errors: {
    getCardsError: false
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
          getCardsError: false
        }
      };
    case actionTypes.GET_CARDS_FAIL:
      return {
        ...state,
        cards: [],
        loading: false,
        errors: {
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
    case actionTypes.UNSELECT_CARD_IN_CARDS:
      return {
        ...state,
        selectedCard: null
      };
     case actionTypes.RESET_GET_CARDS_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};