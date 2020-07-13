import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';

const getPublicCardsSuccess = (cardList) => {
	return {
		type: actionTypes.GET_PUBLIC_CARDS_SUCCESS,
		cardList: cardList,
	};
};

const getPublicCardsFail = () => {
	return {
		type: actionTypes.GET_PUBLIC_CARDS_FAIL,
	};
};

export const getPublicCards = (front) => {
	return (dispatch, getState) => {
		const { searchString } = getState().cards;
		axios
			.get(`/api/publiccards?front=${front || searchString}`)
			.then((res) => dispatch(getPublicCardsSuccess(res.data)))
			.catch((err) => dispatch(getPublicCardsFail()));
	};
};

export const selectPublicCard = (cardId) => {
	return {
		type: actionTypes.SELECT_PUBLIC_CARD,
		cardId: cardId,
	};
};

export const unselectPublicCard = () => {
	return {
		type: actionTypes.UNSELECT_PUBLIC_CARD,
	};
};

const downloadPublicCardSuccess = () => {
	return {
		type: actionTypes.DOWNLOAD_PUBLIC_CARD_SUCCESS,
	};
};

const downloadPublicCardFail = () => {
	return {
		type: actionTypes.DOWNLOAD_PUBLIC_CARD_FAIL,
	};
};

export const downloadPublicCard = (id) => {
	return (dispatch) => {
		axios
			.put(`/api/DownloadedCards/${id}`)
			.then((res) => dispatch(downloadPublicCardSuccess(res.data)))
			.catch((err) => dispatch(downloadPublicCardFail()));
	};
};

const getAdminPublicDecksSuccess = () => {
	return {
		type: actionTypes.GET_ADMIN_PUBLIC_DECKS_SUCCESS,
	};
};

const getAdminPublicDecksFail = () => {
	return {
		type: actionTypes.GET_ADMIN_PUBLIC_DECKS_FAIL,
	};
};

export const getAdminPublicDecks = () => {
	return (dispatch) => {
		axios
			.get(`/api/PublicDecks`)
			.then((res) => dispatch(getAdminPublicDecksSuccess(res.data)))
			.catch((err) => dispatch(getAdminPublicDecksFail()));
	};
};
