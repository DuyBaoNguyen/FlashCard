import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import UserCard from './UserCard/UserCard';
import CardsTable from './CardsTable/CardsTable';
import OptionButton from '../../../components/Shared/OptionButton/OptionButton';
import './CardsProposal.css';
import AdminCard from './AdminCard/AdminCard';

class CardsProposal extends Component {
	componentDidMount() {
		this.props.onGetCardsProposal();
	}

	componentWillUnmount() {
		this.props.onUnselectCard();
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
				{this.props.cardsProposalList.length > 0
					? (
						<>
							<div className="cards-proposal-back">
								<AdminCard /> <UserCard />
							</div>
							<div className="cards-proposal-buttons">
								<OptionButton
									className="cards-proposal-button-approve"
									onClick={() => this.onClickApprove(this.props.currentProposalCard)}
								>
									Approve
								</OptionButton>
								<OptionButton
									className="cards-proposal-button-decline"
									onClick={() => this.onClickDecline(this.props.currentProposalCard)}
								>
									Decline
								</OptionButton>
							</div>
						</>
					) : (
						<div className="text-notification">Click a proposal to see more information!</div>
					)
				}
			</div>
		);
		return (
			<div className="cards-proposal-wrapper">
				<div className="cards-proposal-left">
					<CardsTable cardsProposalList={this.props.cardsProposalList} />
				</div>
				{content}
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
		onUnselectCard: () => dispatch(actions.unselectProposedCard())
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(CardsProposal));
