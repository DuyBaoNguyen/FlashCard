import * as actionTypess from '../actions/actionTypes';

const initialState = {
  selectedPractice: null,
  rememberedCards: []
};

export const statisticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypess.SELECT_PRACTICE:
      return {
        ...state,
        selectedPractice: action.practice,
        rememberedCards: action.rememberedCards || []
      };
    case actionTypess.UNSELECT_PRACTICE:
      return {
        ...state,
        selectedPractice: null,
        rememberedCards: []
      };
    default:
      return state;
  }
};