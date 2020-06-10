import * as actionTypes from '../actions/actionTypes';
import { transformStatistics } from '../../util/util';

const initialState = {
	deck: null,
	getDeckError: false,
	statistics: null,
	getStatisticsError: false,
	cards: [],
	getCardsError: false,
	deleteDeckError: false,
	updateDeckPublicStatusError: false
};

export const deckDetailReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_DECK_SUCCESS:
			return {
				...state,
				deck: action.deck,
				getDeckError: false,
			};
		case actionTypes.GET_DECK_FAIL:
			return {
				...state,
				deck: null,
				getDeckError: true,
			};
		case actionTypes.GET_DECK_STATISTICS_SUCCESS:
			return {
				...state,
				statistics: transformStatistics(action.statistics),
				getStatisticsError: false,
			};
		case actionTypes.GET_DECK_STATISTICS_FAIL:
			return {
				...state,
				statistics: null,
				getStatisticsError: true,
			};
		case actionTypes.GET_DECK_CARDS_SUCCESS:
			return {
				...state,
				cards: action.cards,
				getCardsError: false,
			};
		case actionTypes.GET_DECK_CARDS_FAIL:
			return {
				...state,
				cards: [],
				getCardsError: true,
			};
		case actionTypes.DELETE_DECK_SUCCESS:
			return {
				...state,
				deck: null,
				getDeckError: false,
				statistics: null,
				getStatisticsError: false,
				cards: [],
				getCardsError: false,
				deleteDeckError: false,
			};
		case actionTypes.DELETE_DECK_FAIL:
			return {
				...state,
				deleteDeckError: true,
			};
		case actionTypes.UPDATE_DECK_PUBLIC_STATUS_SUCCESS:
			return {
				...state,
				updateDeckPublicStatusError: false
			};
		case actionTypes.UPDATE_DECK_PUBLIC_STATUS_FAIL:
			return {
				...state,
				updateDeckPublicStatusError: true
			};
		default:
			return state;
	}
};
