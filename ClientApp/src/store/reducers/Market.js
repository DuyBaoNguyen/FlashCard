import * as actionTypes from '../actions/actionTypes';

const initialState = {
	cardList: [],
	getCardsError: null,
	selectedCard: null,
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
		default:
			return state;
	}
};
