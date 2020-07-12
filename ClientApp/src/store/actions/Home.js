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
	return (dispatch) => {
		axios
			.get(`/api/decks?name=${name}`)
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

export const updateNameSuccess = () => {
	return {
		type: actionTypes.UPDATE_NAME_SUCCESS,
	};
};

export const updateNameFail = () => {
	return {
		type: actionTypes.UPDATE_NAME_FAIL,
	};
};

export const updateName = (displayName) => {
	return (dispatch) => {
		axios
			.put('/api/currentuser', {
				displayName: displayName,
			})
			.then((res) => {
				dispatch(updateNameSuccess());
			})
			.catch((err) => dispatch(updateNameFail()));
	};
};

const updateAvatarSuccess = () => {
	return {
		type: actionTypes.UPDATE_AVATAR_SUCCESS,
	};
};

const updateAvatarFail = () => {
	return {
		type: actionTypes.UPDATE_AVATAR_FAIL,
	};
};

export const updateAvatar = (image) => {
	return (dispatch) => {
		const formData = new FormData();
		formData.append('image', image);

		axios
			.put(`/api/currentuser/picture`, formData)
			.then(() => {
				dispatch(updateAvatarSuccess());
			})
			.catch(() => dispatch(updateAvatarFail()));
	};
};
