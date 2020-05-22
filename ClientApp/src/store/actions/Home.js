import axios from '../../axios';
import * as actionTypes from '../actions/actionTypes';

// tao actions
// return action
export const getDecksSuccess = (decks) => {
	return {
		type: actionTypes.GETDECKSSUCCESS,
		decks: decks,
	};
};

export const getDecksFailed = () => {
	return {
		type: actionTypes.GETDECKSFAILED,
	};
};

// return dispatch
export const getDecks = () => {
	return (dispatch) => {
    axios.get('/api/decks')
    .then((res) => {
			dispatch(getDecksSuccess(res.data));
    })
    .catch((err) => {
      dispatch(getDecksFailed())
    });
	};
};