import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';
import authService from '../../components/api-authorization/AuthorizeService';

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
