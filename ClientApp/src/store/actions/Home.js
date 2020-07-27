import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';
import authService from '../../components/api-authorization/AuthorizeService';

export const getDecksSuccess = (decks) => {
	return {
		type: actionTypes.GET_DECKS_SUCCESS,
		decks: decks,
	};
};

export const getDecksFailed = () => {
	return {
		type: actionTypes.GET_DECKS_FAILED,
	};
};

export const getDecks = (name) => {
	return (dispatch, getState) => {
		const { decksSearchString: searchString } = getState().home;
		axios
			.get(`/api/decks?name=${name || searchString}`)
			.then((res) => {
				dispatch(getDecksSuccess(res.data));
			})
			.catch((err) => {
				dispatch(getDecksFailed());
			});
	};
};

export const getStatisticsSuccess = (statistics) => {
	return {
		type: actionTypes.GET_STATISTICS_SUCCESS,
		statistics: statistics,
	};
};

export const getStatisticsFail = () => {
	return {
		type: actionTypes.GET_STATISTICS_FAIL,
	};
};

export const getStatistics = () => {
	return (dispatch) => {
		axios
			.get('/api/statistics/test')
			.then((res) => dispatch(getStatisticsSuccess(res.data)))
			.catch((err) => dispatch(getStatisticsFail()));
	};
};

export const getProfileSuccess = (profile) => {
	return {
		type: actionTypes.GET_PROFILE_SUCCESS,
		profile: profile,
	};
};

export const getProfileFail = () => {
	return {
		type: actionTypes.GET_PROFILE_FAIL,
	};
};

export const getProfile = () => {
	return (dispatch) => {
		authService
			.getAccessToken()
			.then((token) => {
				return axios.get('/api/currentuser', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
			})
			.then((res) => dispatch(getProfileSuccess(res.data)))
			.catch((err) => dispatch(getProfileFail()));
	};
};

export const setDecksFilteredValue = (filteredValue) => {
	return {
		type: actionTypes.SET_DECKS_FILTERED_VALUE,
		filteredValue: filteredValue,
	};
};

export const filterDecks = (filteredValue) => {
	return {
		type: actionTypes.FILTER_DECKS,
		filteredValue: filteredValue,
	};
};

export const updateCurrentUserNameSuccess = () => {
	return {
		type: actionTypes.UPDATE_CURRENT_USER_NAME_SUCCESS,
	};
};

export const updateCurrentUserNameFail = (error) => {
	return {
		type: actionTypes.UPDATE_CURRENT_USER_NAME_FAIL,
		error: error
	};
};

export const updateCurrentUserName = (displayName) => {
	return (dispatch) => {
		axios.put('/api/currentuser', { displayName: displayName, })
			.then(() => {
				dispatch(updateCurrentUserNameSuccess());
				dispatch(toggleNameUpdatingForm(false));
				dispatch(getProfile());
			})
			.catch((err) => {
				if (err.response.status === 400) {
					dispatch(updateCurrentUserNameFail(err.response.data))
				}
			});
	};
};

const updateCurrentUserPictureSuccess = () => {
	return {
		type: actionTypes.UPDATE_CURRENT_USER_PICTURE_SUCCESS
	};
};

const updateCurrentUserPictureFail = () => {
	return {
		type: actionTypes.UPDATE_CURRENT_USER_PICTURE_FAIL
	};
};

export const updateCurrentUserPicture = (picture) => {
	return (dispatch) => {
		const formData = new FormData();
		formData.append('picture', picture);

		axios.put(`/api/currentuser/picture`, formData)
			.then(() => {
				dispatch(updateCurrentUserPictureSuccess());
				dispatch(getProfile());
			})
			.catch(() => dispatch(updateCurrentUserPictureFail()));
	};
};

export const toggleNameUpdatingForm = (value) => {
	return {
		type: actionTypes.TOGGLE_NAME_UPDATING_FORM,
		value: value
	};
};

export const clearUpdateCurrentUserNameError = () => {
	return {
		type: actionTypes.CLEAR_UPDATE_CURRENT_USER_NAME_ERROR
	};
};

const updatePasswordSuccess = () => {
	return {
		type: actionTypes.UPDATE_PASSWORD_SUCCESS
	};
};

const updatePasswordFail = (error) => {
	return {
		type: actionTypes.UPDATE_PASSWORD_FAIL,
		error: error
	};
};

export const updatePassword = (oldPassword, newPassword, confirmPassword) => {
	return dispatch => {
		axios.put('/api/currentuser/password', { oldPassword, newPassword, confirmPassword })
			.then(() => {
				dispatch(updatePasswordSuccess());
				dispatch(togglePasswordUpdatingForm(false));
			})
			.catch(err => {
				if (err.response.status === 400) {
					dispatch(updatePasswordFail(err.response.data));
				}
			});
	};
}

export const togglePasswordUpdatingForm = (value) => {
	return {
		type: actionTypes.TOGGLE_PASSWORD_UPDATING_FORM,
		value: value
	};
};

export const clearUpdatePasswordError = () => {
	return {
		type: actionTypes.CLEAR_UPDATE_PASSWORD_ERROR
	};
};

const getShortcutsSuccess = (shortcuts) => {
	return {
		type: actionTypes.GET_SHORTCUTS_SUCCESS,
		shortcuts: shortcuts
	}
};

const getShortcutsFail = () => {
	return {
		type: actionTypes.GET_SHORTCUTS_FAIL
	}
};

export const getShortcuts = (name) => {
	return (dispatch, getState) => {
		const { shortcutsSearchString: searchString } = getState().home;
		axios.get(`/api/shortcuts?name=${name || searchString}`)
			.then(res => dispatch(getShortcutsSuccess(res.data)))
			.catch(() => dispatch(getShortcutsFail()));
	};
};

export const updateShortcutsSearchString = (value) => {
	return {
		type: actionTypes.UPDATE_SHORTCUTS_SEARCH_STRING,
		value: value
	};
};

export const updateDecksSearchString = (value) => {
	return {
		type: actionTypes.UPDATE_DECKS_SEARCH_STRING,
		value: value
	};
};

export const updateShortcutsFilteredValue = (value) => {
	return {
		type: actionTypes.UPDATE_SHORTCUTS_FILTERED_VALUE,
		value: value
	};
};

export const filterShortcuts = (filteredValue) => {
	return {
		type: actionTypes.FILTER_SHORTCUTS,
		filteredValue: filteredValue
	};
};

export const changeHomeTab = (tab) => {
	return {
		type: actionTypes.CHANGE_HOME_TAB,
		tab: tab
	};
};