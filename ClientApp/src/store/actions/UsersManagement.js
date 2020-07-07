import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';

const getUsersSuccess = (usersList) => {
	return {
		type: actionTypes.GET_USERS_SUCCESS,
		usersList: usersList,
	};
};

const getUsersFail = () => {
	return {
		type: actionTypes.GET_USERS_FAIL,
	};
};

export const getUsers = () => {
	return (dispatch) => {
		axios
			.get(`/api/admin/users`)
			.then((res) => dispatch(getUsersSuccess(res.data)))
			.catch((err) => dispatch(getUsersFail()));
	};
};

export const setCurrentUser = (currentUser) => {
	return {
		type: actionTypes.SET_CURRENT_USER,
		currentUser: currentUser,
	};
};

const getCurrentUserSuccess = (currentUserData) => {
	return {
		type: actionTypes.GET_CURRENT_USER_SUCCESS,
		currentUserData: currentUserData,
	};
};

const getCurrentUserFail = () => {
	return {
		type: actionTypes.GET_CURRENT_USER_FAIL,
	};
};

export const getCurrentUser = (currentUser) => {
	return (dispatch) => {
		axios
			.get(`/api/admin/users/${currentUser}`)
			.then((res) => dispatch(getCurrentUserSuccess(res.data)))
			.catch((err) => dispatch(getCurrentUserFail()));
	};
};

export const deleteCurrentUser = (currentUser) => {
	return (dispatch) => {
		axios
			.delete(`/api/admin/users/${currentUser}`)
			.then((res) => dispatch(getCurrentUserSuccess(res.data)))
			.catch((err) => dispatch(getCurrentUserFail()));
	};
};

const getCurrentUserDecksSuccess = (currentUserDecks) => {
	return {
		type: actionTypes.GET_CURRENT_USER_DECKS_SUCCESS,
		currentUserDecks: currentUserDecks,
	};
};

const getCurrentUserDecksFail = () => {
	return {
		type: actionTypes.GET_CURRENT_USER_DECKS_FAIL,
	};
};

export const getCurrentUserDecks = (currentUser) => {
	return (dispatch) => {
		axios
			.get(`/api/admin/users/${currentUser}/decks`)
			.then((res) => dispatch(getCurrentUserDecksSuccess(res.data)))
			.catch((err) => dispatch(getCurrentUserDecksFail()));
	};
};
