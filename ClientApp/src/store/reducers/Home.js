import * as actionTypes from '../actions/actionTypes';
import * as utils from '../../util/util';

const initialState = {
  decks: [],
  originalDecks: [],
  statistics: null,
  percentPracticedCardsStatistics: null,
  amountRememberedCardsStatistics: null,
  profile: null,
  nameUpdatingFormOpened: false,
  loadings: {
    getDecksLoading: true
  },
  filteredValues: {
    decksFilteredValue: ''
  },
  errors: {
    getDeckError: false,
    getStatisticsError: false,
    getProfileError: false,
    updateCurrentUserNameError: null,
    updateCurrentUserPictureError: false
  }
};

export const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DECKS_SUCCESS:
      return {
        ...state,
        decks: utils.filterDecks(action.decks, state.filteredValues.decksFilteredValue),
        originalDecks: action.decks,
        loadings: {
          ...state.loadings,
          getDecksLoading: false
        },
        errors: {
          ...state.errors,
          getDeckError: false
        }
      };
    case actionTypes.GET_DECKS_FAILED:
      return {
        ...state,
        decks: [],
        originalDecks: [],
        loadings: {
          ...state.loadings,
          getDecksLoading: false
        },
        errors: {
          ...state.errors,
          getDeckError: true
        }
      };
    case actionTypes.GET_STATISTICS_SUCCESS:
      return {
        ...state,
        statistics: action.statistics,
        percentPracticedCardsStatistics: utils.transformPercentPracticedCardsStatistics(action.statistics),
        amountRememberedCardsStatistics: utils.transformAmountRememberedCardsStatistics(action.statistics),
        errors: {
          ...state.errors,
          getStatisticsError: false
        }
      }
    case actionTypes.GET_STATISTICS_FAIL:
      return {
        ...state,
        statistics: null,
        percentPracticedCardsStatistics: null,
        amountRememberedCardsStatistics: null,
        errors: {
          ...state.errors,
          getStatisticsError: true
        }
      }
    case actionTypes.GET_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.profile,
        errors: {
          ...state.errors,
          getProfileError: false
        }
      }
    case actionTypes.GET_PROFILE_FAIL:
      return {
        ...state,
        profile: null,
        errors: {
          ...state.errors,
          getProfileError: true
        }
      }
    case actionTypes.SET_DECKS_FILTERED_VALUE:
      return {
        ...state,
        filteredValues: {
          ...state.filteredValues,
          decksFilteredValue: action.filteredValue
        }
      };
    case actionTypes.FILTER_DECKS:
      return {
        ...state,
        decks: utils.filterDecks(state.originalDecks, action.filteredValue)
      };
    case actionTypes.UPDATE_CURRENT_USER_NAME_SUCCESS:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateCurrentUserNameError: null
        }
      };
    case actionTypes.UPDATE_CURRENT_USER_NAME_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateCurrentUserNameError: action.error
        }
      };
    case actionTypes.UPDATE_CURRENT_USER_PICTURE_SUCCESS:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateCurrentUserPictureError: false
        }
      };
    case actionTypes.UPDATE_CURRENT_USER_PICTURE_FAIL:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateCurrentUserPictureError: true
        }
      };
    case actionTypes.TOGGLE_NAME_UPDATING_FORM:
      return {
        ...state,
        nameUpdatingFormOpened: action.value
      };
    case actionTypes.CLEAR_UPDATE_CURRENT_USER_NAME_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          updateCurrentUserNameError: null
        }
      };
    default:
      return state;
  }
};