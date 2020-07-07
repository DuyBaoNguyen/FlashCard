import * as actionTypes from '../actions/actionTypes';

const initialState = {
	usersList: [],
	currentUser: null,
	currentUserData: null,
	getUsersError: null,
};

export const usersManagementReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_USERS_SUCCESS:
			return {
				...state,
				usersList: action.usersList,
				getUsersError: null,
			};
		case actionTypes.GET_USERS_FAIL:
			return {
				...state,
				usersList: [],
				getUsersError: 'Get users list failed!',
			};
		case actionTypes.SET_CURRENT_USER:
			return {
				...state,
				currentUser: action.currentUser,
			};
		case actionTypes.GET_CURRENT_USER_SUCCESS:
			return {
				...state,
				currentUserData: action.currentUserData,
				getUsersError: null,
			};
		case actionTypes.GET_CURRENT_USER_FAIL:
			return {
				...state,
				currentUserData: null,
				getUsersError: 'Get current user failed!',
			};
			case actionTypes.DELETE_CURRENT_USER:
				return {
					...state,
					currentUserData: null,
				};
		default:
			return state;
	}
};
