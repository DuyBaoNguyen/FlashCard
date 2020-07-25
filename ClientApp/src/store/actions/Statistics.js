import * as actionTypes from './actionTypes';

export const selectPractice = (practice, rememberedCards) => ({
  type: actionTypes.SELECT_PRACTICE,
  practice: practice,
  rememberedCards: rememberedCards
});

export const unselectPractice = () => ({
  type: actionTypes.UNSELECT_PRACTICE
});