import * as actionTypes from '../actions/actionTypes';

const initialState = {
  card: null,
  cardFrontFormOpened: false,
  errors: {
    updateCardError: null,
    getCardError: false
  }
};

export const cardReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_CARD_SUCCESS:
      return {
        ...state,
        card: action.card,
        errors: {
          ...state.errors,
          getCardError: false
        }
      };
    case actionTypes.GET_CARD_FAIL:
      return {
        ...state,
        card: null,
        errors: {
          ...state.errors,
          getCardError: true
        }
      };
    case actionTypes.UPDATE_CARD_SUCCESS:
      return {
        ...state,
        cardFrontFormOpened: false,
        errors: {
          ...state.errors,
          updateCardError: null
        }
      };
    case actionTypes.CREATE_CARD_FAIL:
    case actionTypes.UPDATE_CARD_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateCardError: action.error
        }
      };
    case actionTypes.CLEAR_UPDATE_CARD_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateCardError: null
        }
      };
    case actionTypes.TOGGLE_CARD_FRONT_FORM:
      return {
        ...state,
        cardFrontFormOpened: action.opened
      };
    case actionTypes.RESET_STATE_IN_CARD_REDUCER:
      return initialState;
    default:
      return state;
  }
};