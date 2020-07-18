import * as actionTypes from './actionTypes';
import axios from '../../axios';
import * as actions from './index';

const getCardsProposalSuccess = (cardsProposalList) => {
	return {
		type: actionTypes.GET_CARDS_PROPOSAL_SUCCESS,
		cardsProposalList: cardsProposalList,
	};
};

const getCardsProposalFail = () => {
	return {
		type: actionTypes.GET_CARDS_PROPOSAL_FAIL,
	};
};

export const getCardsProposal = () => {
	return (dispatch) => {
		axios
			.get(`api/admin/proposedcards`)
			.then((res) => dispatch(getCardsProposalSuccess(res.data)))
			.catch((error) => dispatch(getCardsProposalFail()));
	};
};

const getCurrentProposalCardSuccess = (currentProposalCard) => {
	return {
		type: actionTypes.GET_CURRENT_PROPOSAL_CARD_SUCCESS,
		currentProposalCard: currentProposalCard,
	};
};

const getCurrentProposalCardFail = () => {
	return {
		type: actionTypes.GET_CURRENT_PROPOSAL_CARD_FAIL,
	};
};

export const getCurrentProposalCard = (cardId) => {
	return (dispatch) => {
		axios
			.get(`/api/admin/proposedcards/${cardId}`)
			.then((res) => dispatch(getCurrentProposalCardSuccess(res.data)))
			.catch((error) => dispatch(getCurrentProposalCardFail()));
	};
};

const approveCurrentCardSuccess = (currentProposalCard) => {
	return {
		type: actionTypes.APPROVE_CURRENT_CARD_SUCCESS,
	};
};

const approveCurrentCardFail = () => {
	return {
		type: actionTypes.APPROVE_CURRENT_CARD_FAIL,
	};
};

export const approveCurrentCard = (currentProposalCard) => {
	let backs = currentProposalCard.backs?.map((back, index) => {
		return back.id;
	});
	let form = {
		proposedBacks: backs,
		approve: true,
	};
	console.log(form);
	return (dispatch) => {
		axios
			.put(`/api/admin/proposedbacks`, form)
			.then((res) => {
				dispatch(approveCurrentCardSuccess(res.data));
				dispatch(getCardsProposal());
			})
			.catch((error) => dispatch(approveCurrentCardFail()));
	};
};

const declineCurrentCardSuccess = (currentProposalCard) => {
	return {
		type: actionTypes.APPROVE_CURRENT_CARD_SUCCESS,
	};
};

const declineCurrentCardFail = () => {
	return {
		type: actionTypes.APPROVE_CURRENT_CARD_FAIL,
	};
};

export const declineCurrentCard = (currentProposalCard) => {
	let backs = currentProposalCard.backs?.map((back, index) => {
		return back.id;
	});
	let form = {
		proposedBacks: backs,
		approve: false,
	};
	console.log(form);
	return (dispatch) => {
		axios
			.put(`/api/admin/proposedbacks`, form)
			.then((res) => {
				dispatch(approveCurrentCardSuccess(res.data));
				dispatch(getCardsProposal());
			})
			.catch((error) => dispatch(approveCurrentCardFail()));
	};
};
