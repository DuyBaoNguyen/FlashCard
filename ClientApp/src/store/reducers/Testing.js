import * as actionTypes from '../actions/actionTypes';

const initialState = {
	cardList: [],
	getCardsError: null,
	currentVocab: null,
	sendResultError: null,
	succeededCardIds: null,
	failedCardIds: null,
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
		case actionTypes.UPDATE_CARDS_IN_DECK:
			return {
				...state,
				cardList: action.cardList,
				// succeededCardIds: action.succeededCardIds,
				// failedCardIds: action.failedCardIds,
				sendResultError: null,
			};
		case actionTypes.SEND_TEST_RESULT_SUCCESS:
			return {
				...state,
				sendResultError: null,
			};
		case actionTypes.SEND_TEST_RESULT_FAIL:
			return {
				...state,
				sendResultError: 'Send result failed!',
			};
		default:
			return state;
	}
};
