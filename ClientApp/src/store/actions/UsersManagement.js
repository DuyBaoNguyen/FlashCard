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