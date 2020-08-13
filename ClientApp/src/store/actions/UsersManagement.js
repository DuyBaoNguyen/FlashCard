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
	return (dispatch, getState) => {
		const { searchString } = getState().usersmanagement;
		axios.get(`/api/admin/users?search=${searchString}`)
			.then((res) => {
				dispatch(getUsersSuccess(res.data));

				// const { currentUserId } = getState().usersmanagement;
				// if (!res.data.find(user => user.id === currentUserId)) {
				// 	const firstUserId = res.data[0]?.id;
				// 	if (firstUserId) {
				// 		dispatch(setCurrentUserId(firstUserId));
				// 		dispatch(getCurrentUser(firstUserId));
				// 		dispatch(getCurrentUserStatistics(firstUserId));
				// 		dispatch(getCurrentUserDecks(firstUserId));
				// 		dispatch(getCurrentUserCards(firstUserId));
				// 	}
				// }
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
			.then(() => {
				dispatch(deleteCurrentUserSuccess());
				dispatch(getUsers());
			})
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

export const selectUserCard = (cardId) => {
	return {
		type: actionTypes.SELECT_USER_CARD,
		cardId: cardId
	};
};

export const unselectUserCard = () => {
	return {
		type: actionTypes.UNSELECT_USER_CARD
	};
};

export const checkToUnselectUserCard = (cardId) => {
	return {
		type: actionTypes.CHECK_TO_UNSELECT_USER_CARD,
		cardId: cardId
	};
};

const getCurrentUserStatisticsSuccess = (statistics) => {
	return {
		type: actionTypes.GET_CURRENT_USER_STATISTICS_SUCCESS,
		statistics: statistics
	};
};

const getCurrentUserStatisticsFail = () => {
	return {
		type: actionTypes.GET_CURRENT_USER_STATISTICS_FAIL
	};
};

export const getCurrentUserStatistics = (currentUserId) => {
	return dispatch => {
		axios.get(`/api/admin/users/${currentUserId}/test`)
			.then(res => dispatch(getCurrentUserStatisticsSuccess(res.data)))
			.catch(() => dispatch(getCurrentUserStatisticsFail()));
	}
};

export const updateUserSearchString = (value) => {
	return {
		type: actionTypes.UPDATE_USER_SEARCH_STRING,
		value: value
	};
};