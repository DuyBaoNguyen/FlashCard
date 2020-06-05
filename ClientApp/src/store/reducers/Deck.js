import * as actionTypes from '../actions/actionTypes';

const initialState = {
	createDeckError: null,
};

export const deckReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.CREATE_DECK_SUCCESS:
			return {
				...state,
				getDeckError: null,
			};
		case actionTypes.CREATE_DECK_FAIL:
			return {
				...state,
				getDeckError: 'Create deck failed!',
			};
			case actionTypes.EDIT_DECK_SUCCESS:
			return {
				...state,
				editDeckError: null,
			};
		case actionTypes.EDIT_DECK_FAIL:
			return {
				...state,
				editDeckError: 'Edit deck failed!',
			};
		default:
			return state;
	}
};
