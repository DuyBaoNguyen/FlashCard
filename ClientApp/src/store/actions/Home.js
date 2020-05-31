import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';
import authService from '../../components/api-authorization/AuthorizeService';

// tao actions
// return action
export const getDecksSuccess = (decks) => {
	return {
		type: actionTypes.GET_DECKS_SUCCESS,
		decks: decks
	};
};

export const getDecksFailed = () => {
	return {
		type: actionTypes.GET_DECKS_FAILED
	};
};

// return dispatch
export const getDecks = (name) => {
	return (dispatch) => {
		axios.get(`/api/decks?name=${name}`)
			.then((res) => {
				dispatch(getDecksSuccess(res.data));
			})
			.catch((err) => {
				dispatch(getDecksFailed())
			});
	};
};

export const getStatisticsSuccess = (statistics) => {
	return {
		type: actionTypes.GET_STATISTICS_SUCCESS,
		statistics: statistics
	};
};

export const getStatisticsFail = () => {
	return {
		type: actionTypes.GET_STATISTICS_FAIL
	};
};

export const getStatistics = () => {
	return dispatch => {
		axios.get('/api/statistics/test')
			.then(res => dispatch(getStatisticsSuccess(res.data)))
			.catch(err => dispatch(getStatisticsFail()));
	};
}

export const getProfileSuccess = (profile) => {
	return {
		type: actionTypes.GET_PROFILE_SUCCESS,
		profile: profile
	};
};

export const getProfileFail = () => {
	return {
		type: actionTypes.GET_PROFILE_FAIL
	};
};

export const getProfile = () => {
	return dispatch => {
		authService.getAccessToken()
			.then(token => {
				return axios.get('/api/currentuser', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
			})
			.then(res => dispatch(getProfileSuccess(res.data)))
			.catch(err => dispatch(getProfileFail()));
	};
};
