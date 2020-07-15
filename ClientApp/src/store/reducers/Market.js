import * as actionTypes from '../actions/actionTypes';

const initialState = {
	cardList: [],
	getCardsError: null,
	selectedCard: null,
	adminPublicDecks: [],
	usersPublicDecks: [],
};

export const marketReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_PUBLIC_CARDS_SUCCESS:
			return {
				...state,
				cardList: action.cardList,
			};
		case actionTypes.GET_PUBLIC_CARDS_FAIL:
			return {
				...state,
				cardList: [],
				getCardsError: 'Get public cards failed!',
			};
		case actionTypes.SELECT_PUBLIC_CARD:
			return {
				...state,
				selectedCard: state.cardList.find((card) => card.id === action.cardId),
			};
		case actionTypes.UNSELECT_PUBLIC_CARD:
			return {
				...state,
				selectedCard: null,
			};
		case actionTypes.DOWNLOAD_PUBLIC_CARD_SUCCESS:
			return {
				...state,
			};
		case actionTypes.DOWNLOAD_PUBLIC_CARD_FAIL:
			return {
				...state,
			};
		case actionTypes.GET_ADMIN_PUBLIC_DECKS_SUCCESS:
			return {
				...state,
				adminPublicDecks: action.adminPublicDecks,
			};
		case actionTypes.GET_ADMIN_PUBLIC_DECKS_FAIL:
			return {
				...state,
				adminPublicDecks: [],
				getCardsError: 'Get public cards failed!',
			};
		case actionTypes.DOWNLOAD_ADMIN_PUBLIC_DECK_SUCCESS:
			return {
				...state,
			};
		case actionTypes.DOWNLOAD_ADMIN_PUBLIC_DECK_FAIL:
			return {
				...state,
				adminPublicDecks: [],
				getCardsError: 'Download decks failed!',
			};
		case actionTypes.GET_USERS_PUBLIC_DECKS_SUCCESS:
			return {
				...state,
				usersPublicDecks: action.usersPublicDecks,
			};
		case actionTypes.GET_USERS_PUBLIC_DECKS_FAIL:
			return {
				...state,
				usersPublicDecks: [],
				getCardsError: 'Get public cards failed!',
			};
		default:
			return state;
	}
};
