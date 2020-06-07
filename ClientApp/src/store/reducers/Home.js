import * as actionTypes from '../actions/actionTypes';
import { transformStatistics } from '../../util/util';

const initialState = {
  decks: null,
  getDeckError: null,
  statistics: null,
  getStatisticsError: null,
  profile: null,
  getProfileError: null
};

export const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DECKS_SUCCESS:
      return {
        ...state,
        decks: action.decks,
        getDeckError: null,
      };
    case actionTypes.GET_DECKS_FAILED:
      return {
        ...state,
        decks: null,
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
    default:
      return state;
  }
};