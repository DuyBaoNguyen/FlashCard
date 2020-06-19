import axios from '../../axios';
import ReactCardFlip from 'react-card-flip';
import * as actionTypes from '../actions/actionTypes';

const getMatchCardsSuccess = (cardList) => {
	return {
		type: actionTypes.GET_MATCH_CARDS_SUCCESS,
		cardList: cardList,
	};
};

const getMatchCardsFail = () => {
	return {
		type: actionTypes.GET_MATCH_CARDS_FAIL,
	};
};

export const getMatchCards = (id) => {
	return (dispatch) => {
		axios
			.get(`/api/decks/${id}/test/cards?amount=8`)
			.then((res) => dispatch(getMatchCardsSuccess(res.data)))
			.catch((err) => dispatch(getMatchCardsFail()));
	};
};

export const updateMatchCards = (cardList, currentSelectCards, matchedCards) => {
	return {
		type: actionTypes.UPDATE_MATCH_CARDS,
		cardList: cardList,
		currentSelectCards: currentSelectCards,
		matchedCards: matchedCards,
	};
};
