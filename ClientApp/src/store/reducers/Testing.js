import * as actionTypes from '../actions/actionTypes';

const initialState = {
	cardList: [],
	getCardsError: null,
	currentVocab: null,
};

export const testingReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_CARDS_IN_DECK_SUCCESS:
			return {
				...state,
				cardList: action.cardList,
				getCardsError: null,
			};
		case actionTypes.GET_CARDS_IN_DECK_FAIL:
			return {
				...state,
				cardList: [],
				getCardsError: null,
			};
		case actionTypes.UPDATE_RANDOM_CARD:
			return {
				...state,
				currentVocab: action.currentVocab,
			};
		default:
			return state;
	}
};
