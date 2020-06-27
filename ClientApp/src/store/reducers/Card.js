import * as actionTypes from '../actions/actionTypes';

const initialState = {
  card: null,
  selectedBack: null,
  cardFrontFormOpened: false,
  cardBackFormOpened: false,
  errors: {
    updateFrontError: null,
    updateBackError: null,
    getCardError: false,
    deleteBackError: false,
    deleteImageError: false,
    updateImageError: null
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
    case actionTypes.UPDATE_FRONT_SUCCESS:
      return {
        ...state,
        cardFrontFormOpened: false,
        errors: {
          ...state.errors,
          updateFrontError: null
        }
      };
    case actionTypes.CREATE_CARD_FAIL:
    case actionTypes.UPDATE_FRONT_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateFrontError: action.error
        }
      };
    case actionTypes.CLEAR_UPDATE_FRONT_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateFrontError: null
        }
      };
    case actionTypes.SELECT_BACK:
      return {
        ...state,
        selectedBack: state.card.backs.filter(back => back.id === action.backId)[0]
      };
    case actionTypes.UNSELECT_BACK:
      return {
        ...state,
        selectedBack: null
      };
    case actionTypes.TOGGLE_CARD_FRONT_FORM:
      return {
        ...state,
        cardFrontFormOpened: action.opened
      };
    case actionTypes.TOGGLE_CARD_BACK_FORM:
      return {
        ...state,
        cardBackFormOpened: action.opened
      };
    case actionTypes.CREATE_BACK_SUCCESS:
    case actionTypes.UPDATE_BACK_SUCCESS:
      return {
        ...state,
        selectedBack: null,
        cardBackFormOpened: false,
        errors: {
          ...state.errors,
          updateBackError: null
        }
      };
    case actionTypes.CREATE_BACK_FAIL:
    case actionTypes.UPDATE_BACK_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateBackError: action.error
        }
      };
    case actionTypes.DELETE_BACK_SUCCESS:
      return {
        ...state,
        errors: {
          ...state.errors,
          deleteBackError: false
        }
      };
    case actionTypes.DELETE_BACK_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          deleteBackError: true
        }
      };
    case actionTypes.DELETE_IMAGE_SUCCESS:
      return {
        ...state,
        errors: {
          ...state.errors,
          deleteImageError: false
        }
      };
    case actionTypes.DELETE_IMAGE_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          deleteImageError: true
        }
      };
    case actionTypes.UPDATE_IMAGE_SUCCESS:
      return {
        ...state,
        selectedBack: null,
        errors: {
          ...state.errors,
          updateImageError: null
        }
      };
    case actionTypes.UPDATE_IMAGE_FAIL:
      return {
        ...state,
        selectedBack: null,
        errors: {
          ...state.errors,
          updateImageError: action.error
        }
      };
    case actionTypes.CLEAR_UPDATE_BACK_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateBackError: null
        }
      };
    case actionTypes.RESET_STATE_IN_CARD_REDUCER:
      return initialState;
    default:
      return state;
  }
};