import * as actionTypes from '../actions/actionTypes';

const initialState = {
	cardList: [],
	selectedCard: null,
	adminPublicDecks: [],
	userPublicDecks: [],
	publicCardsSearchString: '',
	adminPublicDecksSearchString: '',
	userPublicDecksSearchString: '',
	loadings: {
		getPublicCardsLoading: true,
		getAdminPublicDecksLoading: true,
		getUserPublicDecksLoading: true
	},
	errors: {
		getPublicCardsError: false,
		getAdminPublicDecksError: false,
		getUserPublicDecksError: false,
		pinPublicDeckError: false,
		unpinPublicDeckError: false,
		downloadCardError: false,
		downloadPublicDeckError: false
	}
};

export const marketReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_PUBLIC_CARDS_SUCCESS:
			return {
				...state,
				cardList: action.cardList,
				loadings: {
					...state.loadings,
					getPublicCardsLoading: false
				},
				errors: {
					...state.errors,
					getPublicCardsError: false
				}
			};
		case actionTypes.GET_PUBLIC_CARDS_FAIL:
			return {
				...state,
				cardList: [],
				loadings: {
					...state.loadings,
					getPublicCardsLoading: false
				},
				errors: {
					...state.errors,
					getPublicCardsError: true
				}
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
				errors: {
					...state.errors,
					downloadCardError: false
				}
			};
		case actionTypes.DOWNLOAD_PUBLIC_CARD_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					downloadCardError: true
				}
			};
		case actionTypes.GET_ADMIN_PUBLIC_DECKS_SUCCESS:
			return {
				...state,
				adminPublicDecks: action.adminPublicDecks,
				loadings: {
					...state.loadings,
					getAdminPublicDecksLoading: false
				},
				errors: {
					...state.errors,
					getAdminPublicDecksError: false
				}
			};
		case actionTypes.GET_ADMIN_PUBLIC_DECKS_FAIL:
			return {
				...state,
				adminPublicDecks: [],
				loadings: {
					...state.loadings,
					getAdminPublicDecksLoading: false
				},
				errors: {
					...state.errors,
					getAdminPublicDecksError: true
				}
			};
		case actionTypes.DOWNLOAD_ADMIN_PUBLIC_DECK_SUCCESS:
			return {
				...state,
				errors: {
					...state.errors,
					downloadPublicDeckError: false
				}
			};
		case actionTypes.DOWNLOAD_ADMIN_PUBLIC_DECK_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					downloadPublicDeckError: true
				}
			};
		case actionTypes.GET_USER_PUBLIC_DECKS_SUCCESS:
			return {
				...state,
				userPublicDecks: action.userPublicDecks,
				loadings: {
					...state.loadings,
					getUserPublicDecksLoading: false
				},
				errors: {
					...state.errors,
					getUserPublicDecksError: false
				}
			};
		case actionTypes.GET_USER_PUBLIC_DECKS_FAIL:
			return {
				...state,
				userPublicDecks: [],
				loadings: {
					...state.loadings,
					getUserPublicDecksLoading: false
				},
				errors: {
					...state.errors,
					getUserPublicDecksError: true
				}
			};
		case actionTypes.UPDATE_PUBLIC_CARDS_SEARCH_STRING:
			return {
				...state,
				publicCardsSearchString: action.value
			};
		case actionTypes.UPDATE_ADMIN_PUBLIC_DECKS_SEARCH_STRING:
			return {
				...state,
				adminPublicDecksSearchString: action.value
			};
		case actionTypes.UPDATE_USER_PUBLIC_DECKS_SEARCH_STRING:
			return {
				...state,
				userPublicDecksSearchString: action.value
			};
		case actionTypes.PIN_PUBLIC_DECK_SUCCESS:
			return {
				...state,
				errors: {
					...state.errors,
					pinPublicDeckError: false
				}
			};
		case actionTypes.PIN_PUBLIC_DECK_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					pinPublicDeckError: true
				}
			};
		case actionTypes.UNPIN_PUBLIC_DECK_SUCCESS:
			return {
				...state,
				errors: {
					...state.errors,
					unpinPublicDeckError: false
				}
			};
		case actionTypes.UNPIN_PUBLIC_DECK_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					unpinPublicDeckError: true
				}
			};
		default:
			return state;
	}
};
