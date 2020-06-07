import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';

export const createDeckSuccess = () => {
	return {
		type: actionTypes.CREATE_DECK_SUCCESS,
	};
};

export const createDeckFail = () => {
	return {
		type: actionTypes.CREATE_DECK_FAIL,
	};
};

export const createDeck = (deck) => {
	return (dispatch) => {
		axios
			.post('/api/decks', {
				name: deck.name,
				description: deck.description,
				theme: deck.theme,
			})
			.then((res) => dispatch(createDeckSuccess()))
			.catch((err) => dispatch(createDeckFail()));
	};
};

export const editDeckSuccess = () => {
	return {
		type: actionTypes.EDIT_DECK_SUCCESS,
	};
};

export const editDeckFail = () => {
	return {
		type: actionTypes.EDIT_DECK_FAIL,
	};
};

export const editDeck = (deck, id) => {
	console.log('Edit deck API called')
	return (dispatch) => {
		axios
			.put('/api/decks/' + id, {
				name: deck.name,
				description: deck.description,
				theme: deck.theme,
			})
			.then((res) => dispatch(editDeckSuccess()))
			.catch((err) => dispatch(editDeckFail()));
	};
};
