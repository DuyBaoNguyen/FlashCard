import * as actionTypes from '../actions/actionTypes';
import * as utils from '../../util/util';

const initialState = {
  decks: [],
  originalDecks: [],
  getDeckError: null,
  statistics: null,
  percentPracticedCardsStatistics: null,
  amountRememberedCardsStatistics: null,
  getStatisticsError: null,
  profile: null,
  getProfileError: null,
  loadings: {
    getDecksLoading: true
  },
  filteredValues: {
    decksFilteredValue: ''
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
        getDeckError: null,
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
        getDeckError: 'Something went wrong',
      };
    case actionTypes.GET_STATISTICS_SUCCESS:
      return {
        ...state,
        statistics: action.statistics,
        percentPracticedCardsStatistics: utils.transformPercentPracticedCardsStatistics(action.statistics),
        amountRememberedCardsStatistics: utils.transformAmountRememberedCardsStatistics(action.statistics),
        getStatisticsError: null
      }
    case actionTypes.GET_STATISTICS_FAIL:
      return {
        ...state,
        statistics: null,
        percentPracticedCardsStatistics: null,
        amountRememberedCardsStatistics: null,
        getStatisticsError: 'Something went wrong'
      }
    case actionTypes.GET_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.profile,
        getProfileError: null
      }
    case actionTypes.GET_PROFILE_FAIL:
      return {
        ...state,
        profile: null,
        getProfileError: 'Something went wrong'
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
      case actionTypes.UPDATE_NAME_SUCCESS:
        return {
          ...state,
        };
      case actionTypes.UPDATE_NAME_FAIL:
        return {
          ...state,
          getDeckError: 'Change name failed!',
        };
    default:
      return state;
  }
};