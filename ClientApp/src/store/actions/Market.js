import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';
import history from '../../history';
import * as actions from './index';

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
		const { publicCardsSearchString } = getState().market;
		axios
			.get(`/api/publiccards?front=${front || publicCardsSearchString}`)
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
			.then(() => dispatch(downloadPublicCardSuccess()))
			.catch(() => dispatch(downloadPublicCardFail()));
	};
};

const getAdminPublicDecksSuccess = (adminPublicDecks) => {
	return {
		type: actionTypes.GET_ADMIN_PUBLIC_DECKS_SUCCESS,
		adminPublicDecks: adminPublicDecks,
	};
};

const getAdminPublicDecksFail = () => {
	return {
		type: actionTypes.GET_ADMIN_PUBLIC_DECKS_FAIL,
	};
};

export const getAdminPublicDecks = (name) => {
	return (dispatch, getState) => {
		const { adminPublicDecksSearchString: searchString } = getState().market;
		axios.get(`/api/publicdecks?name=${name || searchString}`)
			.then((res) => dispatch(getAdminPublicDecksSuccess(res.data)))
			.catch((err) => dispatch(getAdminPublicDecksFail()));
	};
};

const downloadAdminPublicDeckSuccess = () => {
	return {
		type: actionTypes.DOWNLOAD_ADMIN_PUBLIC_DECK_SUCCESS,
	};
};

const downloadAdminPublicDeckFail = () => {
	return {
		type: actionTypes.DOWNLOAD_ADMIN_PUBLIC_DECK_FAIL,
	};
};

export const downloadAdminPublicDeck = (id) => {
	return (dispatch) => {
		axios
			.put(`/api/downloadeddecks/${id}`)
			.then(() => {
				if (history.location.pathname.search(/^\/publicdecks\/\d+$/) > -1 ||
					history.location.pathname.search(/^\/userpublicdecks\/\d+$/) > -1) {
					const deckId = /\d+/.exec(history.location.pathname)[0];
					dispatch(actions.getPublicDeck(deckId));
				} else {
					dispatch(getAdminPublicDecks());
					dispatch(getUserPublicDecks());
				}
				dispatch(downloadAdminPublicDeckSuccess())
			})
			.catch(() => dispatch(downloadAdminPublicDeckFail()));
	};
};

const getUserPublicDecksSuccess = (userPublicDecks) => {
	return {
		type: actionTypes.GET_USER_PUBLIC_DECKS_SUCCESS,
		userPublicDecks: userPublicDecks
	};
};

const getUserPublicDecksFail = () => {
	return {
		type: actionTypes.GET_USER_PUBLIC_DECKS_FAIL
	};
};

export const getUserPublicDecks = (name) => {
	return (dispatch, getState) => {
		const { userPublicDecksSearchString: searchString } = getState().market;
		axios.get(`/api/userpublicdecks?name=${name || searchString}`)
			.then((res) => dispatch(getUserPublicDecksSuccess(res.data)))
			.catch(() => dispatch(getUserPublicDecksFail()));
	};
};

export const updatePublicCardsSearchString = (value) => {
	return {
		type: actionTypes.UPDATE_PUBLIC_CARDS_SEARCH_STRING,
		value: value
	};
};

export const updateAdminPublicDecksSearchString = (value) => {
	return {
		type: actionTypes.UPDATE_ADMIN_PUBLIC_DECKS_SEARCH_STRING,
		value: value
	};
};

export const updateUserPublicDecksSearchString = (value) => {
	return {
		type: actionTypes.UPDATE_USER_PUBLIC_DECKS_SEARCH_STRING,
		value: value
	};
};

const pinPublicDeckSuccess = () => {
	return {
		type: actionTypes.PIN_PUBLIC_DECK_SUCCESS
	};
};

const pinPublicDeckFail = () => {
	return {
		type: actionTypes.PIN_PUBLIC_DECK_FAIL
	};
};

export const pinPublicDeck = (deckId) => {
	return dispatch => {
		axios.post(`/api/publicdecks/${deckId}/shortcuts`)
			.then(() => {
				if (history.location.pathname.search(/^\/publicdecks\/\d+$/) > -1 ||
					history.location.pathname.search(/^\/userpublicdecks\/\d+$/) > -1) {
					const deckId = /\d+/.exec(history.location.pathname)[0];
					dispatch(actions.getPublicDeck(deckId));
				} else {
					dispatch(getAdminPublicDecks());
					dispatch(getUserPublicDecks());
				}
				dispatch(pinPublicDeckSuccess());
			})
			.catch(() => dispatch(pinPublicDeckFail()));
	};
};

const unpinPublicDeckSuccess = () => {
	return {
		type: actionTypes.UNPIN_PUBLIC_DECK_SUCCESS
	};
};

const unpinPublicDeckFail = () => {
	return {
		type: actionTypes.UNPIN_PUBLIC_DECK_FAIL
	};
};

export const unpinPublicDeck = (deckId) => {
	return dispatch => {
		axios.delete(`/api/shortcuts/${deckId}`)
			.then(() => {
				if (history.location.pathname.search(/^\/publicdecks\/\d+$/) > -1 ||
					history.location.pathname.search(/^\/userpublicdecks\/\d+$/) > -1) {
					const deckId = /\d+/.exec(history.location.pathname)[0];
					dispatch(actions.getPublicDeck(deckId));
				} else {
					dispatch(getAdminPublicDecks());
					dispatch(getUserPublicDecks());
				}
				dispatch(unpinPublicDeckSuccess());
			})
			.catch(() => dispatch(unpinPublicDeckFail()));
	};
};