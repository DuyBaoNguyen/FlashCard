import * as actionTypes from '../actions/actionTypes';
import { transformStatistics } from '../../util/util';

const initialState = {
  decks: [],
  getDeckError: null,
  statistics: null,
  getStatisticsError: null,
  profile: null,
  getProfileError: null,
  loadings: {
    getDecksLoading: true
  }
};

export const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DECKS_SUCCESS:
      return {
        ...state,
        decks: action.decks,
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
        loadings: {
          ...state.loadings,
          getDecksLoading: false
        },
        getDeckError: 'Something went wrong',
      };
    case actionTypes.GET_STATISTICS_SUCCESS:
      return {
        ...state,
        statistics: transformStatistics(action.statistics),
        getStatisticsError: null
      }
    case actionTypes.GET_STATISTICS_FAIL:
      return {
        ...state,
        statistics: null,
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
    case actionTypes.RESET_STATE_IN_HOME_REDUCER:
      return {
        ...initialState,
        profile: state.profile
      };
    default:
      return state;
  }
};