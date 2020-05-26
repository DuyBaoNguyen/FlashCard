import * as actionTypes from '../actions/actionTypes';

const initialState = {
  decks: null,
  statistics: null,
  error: null,
};

export const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DECKS_SUCCESS:
      return {
        ...state,
        decks: action.decks,
        error: null,
      };
    case actionTypes.GET_DECKS_FAILED:
      return {
        ...state,
        decks: null,
        error: 'Something went wrong',
      };
    case actionTypes.GET_STATISTICS_SUCCESS:
      return {
        ...state,
        statistics: transformStatistics(action.statistics),
        error: null
      }
    case actionTypes.GET_STATISTICS_FAIL:
      return {
        ...state,
        statistics: null,
        error: 'Something went wrong'
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
