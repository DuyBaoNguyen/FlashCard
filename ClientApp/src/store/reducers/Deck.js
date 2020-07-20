import * as actionTypes from '../actions/actionTypes';

const initialState = {
	createDeckError: null,
	editDeckError: null
};

export const deckReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.CREATE_DECK_SUCCESS:
			return {
				...state,
				createDeckError: null,
			};
		case actionTypes.CREATE_DECK_FAIL:
			return {
				...state,
				createDeckError: action.error,
			};
		case actionTypes.EDIT_DECK_SUCCESS:
			return {
				...state,
				editDeckError: null,
			};
		case actionTypes.EDIT_DECK_FAIL:
			return {
				...state,
				editDeckError: action.error,
			};
		case actionTypes.CLEAR_UPDATE_DECK_ERROR:
			return {
				...state,
				createDeckError: null,
				editDeckError: null
			};
		default:
			return state;
	}
};
