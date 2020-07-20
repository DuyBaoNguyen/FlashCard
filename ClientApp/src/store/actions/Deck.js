import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';
import history from '../../history';

export const createDeckSuccess = () => {
	return {
		type: actionTypes.CREATE_DECK_SUCCESS
	};
};

export const createDeckFail = (error) => {
	return {
		type: actionTypes.CREATE_DECK_FAIL,
		error: error
	};
};

export const createDeck = (deck) => {
	return (dispatch) => {
		axios
			.post('/api/decks', deck)
			.then((res) => {
				dispatch(createDeckSuccess());
				history.push(`/decks/${res.data.id}/addcards`);
			})
			.catch((err) => {
				if (err.response.status === 400) {
					dispatch(createDeckFail(err.response.data));
				}
			});
	};
};

export const editDeckSuccess = () => {
	return {
		type: actionTypes.EDIT_DECK_SUCCESS
	};
};

export const editDeckFail = (error) => {
	return {
		type: actionTypes.EDIT_DECK_FAIL,
		error: error
	};
};

export const editDeck = (deckId, deck) => {
	return (dispatch) => {
		axios
			.put(`/api/decks/${deckId}`, deck)
			.then(() => {
				dispatch(editDeckSuccess());
				history.push(history.location.state?.backUrl || '/');
			})
			.catch((err) => {
				if (err.response.status === 400) {
					dispatch(editDeckFail(err.response.data));
				}
			});
	};
};

export const clearUpdateDeckError = () => {
	return {
		type: actionTypes.CLEAR_UPDATE_DECK_ERROR
	};
};