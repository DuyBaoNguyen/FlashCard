import * as actionTypes from '../actions/actionTypes';

const initialState = {
  decks: null,
  getDeckError: null,
  statistics: null,
  getStatisticsError: null,
  profile: null,
  getProfileError: null,
  count: 1
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
    case 'TEST':
      return {
        ...state,
        count: state.count + 1
      }
    default:
      return state;
  }
};

function transformStatistics(statistics) {
  for (let item of statistics) {
    item.day = new Date(item.dateTime).toString().substr(0, 3);
    item.percent = item.gradePointAverage * 100;
  }
  return statistics;
}
