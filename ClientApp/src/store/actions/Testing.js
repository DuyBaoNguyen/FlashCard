import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';

const getCardsInDeckSuccess = (cardList) => {
	return {
		type: actionTypes.GET_CARDS_IN_DECK_SUCCESS,
		cardList: cardList,
	};
};

const getCardsInDeckFail = () => {
	return {
		type: actionTypes.GET_CARDS_IN_DECK_FAIL,
	};
};

export const getCardsInDeck = (id) => {
	return (dispatch) => {
		axios
			.get(`/api/decks/${id}/cards`)
			.then((res) => dispatch(getCardsInDeckSuccess(res.data)))
			.catch((err) => dispatch(getCardsInDeckFail()));
	};
};

export const updateRandomCard = (currentVocab) => {
	return {
		type: actionTypes.UPDATE_RANDOM_CARD,
		currentVocab: currentVocab,
	};
};

export const updateCardsInDeck = (cardList) => {
	return {
		type: actionTypes.UPDATE_CARDS_IN_DECK,
		cardList: cardList,
		// succeededCardIds: succeededCardIds,
		// failedCardIds: failedCardIds,
	};
};

const sendTestResultSuccess = () => {
	return {
		type: actionTypes.GET_CARDS_IN_DECK_SUCCESS,
	};
};

const sendTestResultFail = () => {
	return {
		type: actionTypes.GET_CARDS_IN_DECK_FAIL,
	};
};

export const sendTestResult = (
	id,
	datetime,
	succeededCardIds,
	failedCardIds
) => {
	console.log(`id: ${id}`);
	return (dispatch) => {
		axios
			.post(`/api/decks/${id}/test`, {
				datetime: datetime,
				succeededCardIds: succeededCardIds,
				failedCardIds: failedCardIds,
			})
			.then((res) => dispatch(sendTestResultSuccess()))
			.catch((err) => dispatch(sendTestResultFail()));
	};
};
