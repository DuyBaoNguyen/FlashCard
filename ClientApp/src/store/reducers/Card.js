import * as actionTypes from '../actions/actionTypes';

const initialState = {
  card: null,
  errors: {
    createCardError: null,
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
    case actionTypes.CREATE_CARD_SUCCESS:
      return {
        ...state,
        errors: {
          ...state.errors,
          createCardError: null
        }
      };
    case actionTypes.CREATE_CARD_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          createCardError: action.error
        }
      };
    default:
      return state;
  }
};