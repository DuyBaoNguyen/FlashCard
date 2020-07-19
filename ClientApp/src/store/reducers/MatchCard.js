import * as actionTypes from '../actions/actionTypes';

const initialState = {
	cardList: [],
	currentSelectCards: [],
	matchedCards: [],
	getCardsError: null,
};

export const matchCardReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_MATCH_CARDS_SUCCESS:
			let cardsArray = [];
			let cardList = action.cardList;
			let card = cardList.map((card, index) =>
				cardsArray.push({
					content: card.front,
					isMatched: false,
					isSelected : false,
					type: index,
				})
			);
			card = cardList.map((card, index) =>
				cardsArray.push({
					content: card.backs[0].meaning,
					isMatched: false,
					isSelected : false,
					type: index,
				})
			);
			console.log(cardsArray);
			return {
				...state,
				cardList: cardsArray.sort(function (a, b) {
					return 0.5 - Math.random();
				}),
				getCardsError: null,
			};
		case actionTypes.GET_MATCH_CARDS_FAIL:
			return {
				...state,
				cardList: [],
				getCardsError: 'Get card failed!',
			};
		case actionTypes.UPDATE_MATCH_CARDS:
			return {
				...state,
				cardList: action.cardList,
				currentSelectCards: action.currentSelectCards,
				matchedCards: action.matchedCards,
			};
			case actionTypes.RESET_MATCH_CARDS:
				return {
					...state,
					matchedCards: [],
				};
		default:
			return state;
	}
};
