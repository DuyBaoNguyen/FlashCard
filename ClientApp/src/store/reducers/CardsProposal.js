import * as actionTypes from '../actions/actionTypes';
import * as utils from '../../util/util';

const initialState = {
	cardsProposalList: [],
	currentProposalCard: null,
};

export const cardsProposalReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_CARDS_PROPOSAL_SUCCESS:
			return {
				...state,
				cardsProposalList: action.cardsProposalList,
			};
		case actionTypes.GET_CARDS_PROPOSAL_FAIL:
			return {
				...state,
				cardsProposalList: [],
			};
		case actionTypes.GET_CURRENT_PROPOSAL_CARD_SUCCESS:
			return {
				...state,
				currentProposalCard: action.currentProposalCard,
			};
		case actionTypes.GET_CURRENT_PROPOSAL_CARD_FAIL:
			return {
				...state,
				currentProposalCard: null,
			};
		case actionTypes.APPROVE_CURRENT_CARD_SUCCESS:
			return {
				...state,
				currentProposalCard: null,
			};
		case actionTypes.APPROVE_CURRENT_CARD_FAIL:
			return {
				...state,
			};
		case actionTypes.DECLINE_CURRENT_CARD_SUCCESS:
			return {
				...state,
				currentProposalCard: null,
			};
		case actionTypes.DECLINE_CURRENT_CARD_FAIL:
			return {
				...state,
			};
		case actionTypes.DECLINE_CURRENT_BACK_SUCCESS:
			return {
				...state,
				currentProposalCard: null,
			};
		case actionTypes.DECLINE_CURRENT_BACK_FAIL:
			return {
				...state,
			};
		default:
			return state;
	}
};
