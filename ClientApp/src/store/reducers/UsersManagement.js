import * as actionTypes from '../actions/actionTypes';

const initialState = {
	usersList: [],
	currentUser: null,
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
		default:
			return state;
	}
};
