import * as actionTypes from '../actions/actionTypes';

const initialState = {
  cardList : [],
  getCardError : null,
}

export const testingReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_CARDS_IN_DECK_SUCCESS:
			return {
				...state,
				cardList: action.cardList,
				getCardError : null,
			};
		case actionTypes.GET_CARDS_IN_DECK_FAIL:
			return {
				...state,
				cardList: [],
				getCardError : null,
			};
		default:
			return state;
	}
};
