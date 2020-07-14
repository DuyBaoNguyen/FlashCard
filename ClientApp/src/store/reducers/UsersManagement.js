import * as actionTypes from '../actions/actionTypes';

const initialState = {
	usersList: [],
	currentUserId: null,
	currentUser: null,
	currentUserDecks: [],
	currentUserCards: [],
	selectedCard: null,
	errors: {
		getUsersError: false,
		getCurrentUserError: false,
		getCurrentUserDecksError: false,
		getCurrentUserCardsError: false,
		deleteCurrentUserError: false
	}
};

export const usersManagementReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_USERS_SUCCESS:
			return {
				...state,
				usersList: action.usersList,
				errors: {
					...state.errors,
					getUsersError: false
				}
			};
		case actionTypes.GET_USERS_FAIL:
			return {
				...state,
				usersList: [],
				errors: {
					...state.errors,
					getUsersError: true
				}
			};
		case actionTypes.SET_CURRENT_USER_ID:
			return {
				...state,
				currentUserId: action.currentUserId
			};
		case actionTypes.GET_CURRENT_USER_SUCCESS:
			return {
				...state,
				currentUser: action.currentUser,
				errors: {
					...state.errors,
					getCurrentUserError: false
				}
			};
		case actionTypes.GET_CURRENT_USER_FAIL:
			return {
				...state,
				currentUser: null,
				errors: {
					...state.errors,
					getCurrentUserError: true
				}
			};
		case actionTypes.DELETE_CURRENT_USER_SUCCESS:
			return {
				...state,
				currentUserId: null,
				currentUser: null,
				currentUserDecks: [],
				currentUserCards: [],
				errors: {
					...state.errors,
					deleteCurrentUserError: false
				}
			};
		case actionTypes.DELETE_CURRENT_USER_FAIL:
			return {
				...state,
				errors: {
					...state.errors,
					deleteCurrentUserError: true
				}
			};
		case actionTypes.GET_CURRENT_USER_DECKS_SUCCESS:
			return {
				...state,
				currentUserDecks: action.currentUserDecks,
				errors: {
					...state.errors,
					getCurrentUserDecksError: false
				}
			};
		case actionTypes.GET_CURRENT_USER_DECKS_FAIL:
			return {
				...state,
				currentUserDecks: [],
				errors: {
					...state.errors,
					getCurrentUserDecksError: true
				}
			};
		case actionTypes.GET_CURRENT_USER_CARDS_SUCCESS:
			return {
				...state,
				currentUserCards: action.currentUserCards,
				errors: {
					...state.errors,
					getCurrentUserCardsError: false
				}
			};
		case actionTypes.GET_CURRENT_USER_CARDS_FAIL:
			return {
				...state,
				currentUserCards: [],
				errors: {
					...state.errors,
					getCurrentUserCardsError: true
				}
			};
		case actionTypes.SELECT_USER_CARD:
			return {
				...state,
				selectedCard: state.currentUserCards.find(card => card.id === action.cardId)
			};
		case actionTypes.UNSELECT_USER_CARD:
			return {
				...state,
				selectedCard: null
			};
		case actionTypes.CHECK_TO_UNSELECT_USER_CARD:
			return {
				...state,
				selectedCard: state.selectedCard?.id === action.cardId ? null : state.selectedCard
			};
		default:
			return state;
	}
};
