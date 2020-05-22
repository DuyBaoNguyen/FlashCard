import * as actionTypes from '../actions/actionTypes';

const initialState = {
	decks: null,
	statistics: null,
	error: null,
};

export const homeReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GETDECKSSUCCESS:
			return {
				...state,
				decks: action.decks,
				error: null,
			};
		case actionTypes.GETDECKSFAILED:
			return {
				...state,
				decks: null,
				error: 'FAILED',
			};
		default:
			return state;
	}
};
