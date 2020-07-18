import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import UserCard from './UserCard/UserCard';
import CardsTable from './CardsTable/CardsTable';
import Button from '../../../components/Shared/Button/Button';
import './CardsProposal.css';
import AdminCard from './AdminCard/AdminCard';

class CardsProposal extends Component {
	componentDidMount() {
		this.props.onGetCardsProposal();
	}

	onClickApprove = (card) => {
		this.props.onApproveCurrentCard(card);
	};

	onClickDecline = (card) => {
		this.props.onDeclineCurrentCard(card);
	};
	
	render() {
		let content = (
			<div className="cards-proposal-right">
				<div className="cards-proposal-back">
					<AdminCard /> <UserCard />
				</div>
				<div className="cards-proposal-buttons">
					<Button
						className="cards-proposal-button-approve"
						onClick={() => this.onClickApprove(this.props.currentProposalCard)}
					>
						Approve
					</Button>
					<Button
						className="cards-proposal-button-decline"
						onClick={() => this.onClickDecline(this.props.currentProposalCard)}
					>
						Decline
					</Button>
				</div>
			</div>
		);
		return (
			<div className="cards-proposal-wrapper">
				<div className="cards-proposal-left">
					<CardsTable cardsProposalList={this.props.cardsProposalList} />
				</div>
				{this.props.currentProposalCard === null ? '' : content}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		cardsProposalList: state.cardsProposal.cardsProposalList,
		currentProposalCard: state.cardsProposal.currentProposalCard,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetCardsProposal: () => dispatch(actions.getCardsProposal()),
		onApproveCurrentCard: (currentProposalCard) =>
			dispatch(actions.approveCurrentCard(currentProposalCard)),
		onDeclineCurrentCard: (currentProposalCard) =>
			dispatch(actions.declineCurrentCard(currentProposalCard)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(CardsProposal));
