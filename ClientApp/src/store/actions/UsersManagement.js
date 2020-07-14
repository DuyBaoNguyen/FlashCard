import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';

const getUsersSuccess = (usersList) => {
	return {
		type: actionTypes.GET_USERS_SUCCESS,
		usersList: usersList
	};
};

const getUsersFail = () => {
	return {
		type: actionTypes.GET_USERS_FAIL
	};
};

export const getUsers = () => {
	return (dispatch) => {
		axios.get('/api/admin/users')
			.then((res) => {
				dispatch(getUsersSuccess(res.data));

				const firstUserId = res.data[0]?.id;
				if (firstUserId) {
					dispatch(setCurrentUserId(firstUserId));
					dispatch(getCurrentUser(firstUserId));
					dispatch(getCurrentUserDecks(firstUserId));
					dispatch(getCurrentUserCards(firstUserId));
				}
			})
			.catch(() => dispatch(getUsersFail()));
	};
};

export const setCurrentUserId = (currentUserId) => {
	return {
		type: actionTypes.SET_CURRENT_USER_ID,
		currentUserId: currentUserId
	};
};

const getCurrentUserSuccess = (currentUser) => {
	return {
		type: actionTypes.GET_CURRENT_USER_SUCCESS,
		currentUser: currentUser
	};
};

const getCurrentUserFail = () => {
	return {
		type: actionTypes.GET_CURRENT_USER_FAIL
	};
};

export const getCurrentUser = (currentUserId) => {
	return (dispatch) => {
		axios.get(`/api/admin/users/${currentUserId}`)
			.then((res) => dispatch(getCurrentUserSuccess(res.data)))
			.catch(() => dispatch(getCurrentUserFail()));
	};
};

const deleteCurrentUserSuccess = () => {
	return {
		type: actionTypes.DELETE_CURRENT_USER_SUCCESS
	};
};

const deleteCurrentUserFail = () => {
	return {
		type: actionTypes.DELETE_CURRENT_USER_FAIL
	};
};

export const deleteCurrentUser = (currentUserId) => {
	return (dispatch) => {
		axios.delete(`/api/admin/users/${currentUserId}`)
			.then(() => dispatch(deleteCurrentUserSuccess()))
			.catch(() => dispatch(deleteCurrentUserFail()))
	};
};

const getCurrentUserDecksSuccess = (currentUserDecks) => {
	return {
		type: actionTypes.GET_CURRENT_USER_DECKS_SUCCESS,
		currentUserDecks: currentUserDecks
	};
};

const getCurrentUserDecksFail = () => {
	return {
		type: actionTypes.GET_CURRENT_USER_DECKS_FAIL
	};
};

export const getCurrentUserDecks = (currentUserId) => {
	return (dispatch) => {
		axios.get(`/api/admin/users/${currentUserId}/decks`)
			.then((res) => dispatch(getCurrentUserDecksSuccess(res.data)))
			.catch(() => dispatch(getCurrentUserDecksFail()));
	};
};

const getCurrentUserCardsSuccess = (currentUserCards) => {
	return {
		type: actionTypes.GET_CURRENT_USER_CARDS_SUCCESS,
		currentUserCards: currentUserCards
	};
};

const getCurrentUserCardsFail = () => {
	return {
		type: actionTypes.GET_CURRENT_USER_CARDS_FAIL
	};
};

export const getCurrentUserCards = (currentUserId) => {
	return (dispatch) => {
		axios.get(`/api/admin/users/${currentUserId}/cards`)
			.then((res) => dispatch(getCurrentUserCardsSuccess(res.data)))
			.catch(() => dispatch(getCurrentUserCardsFail()));
	};
};
