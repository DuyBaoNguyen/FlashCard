import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler';
import * as actions from '../../../../store/actions/index';
import { Icon } from '@iconify/react';
import closeIcon from '@iconify/icons-uil/multiply';

import Back from '../../../../components/User/Back/Back';
import './UserCard.css';

class UserCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	onClickDeclineBack = (backId, cardId) => {
		this.props.onDeclineCurrentBack(backId, cardId);
	};

	render() {
		let backs = this.props.currentProposalCard?.backs.map((back, index) => {
			return (
				<div key={back.id} className="cards-proposal-back-card">
					{this.props.currentProposalCard.backs.length === 1 ? (
						''
					) : (
							<span
								className="cards-proposal-back-close-btn"
								onClick={() =>
									this.onClickDeclineBack(
										back.id,
										this.props.currentProposalCard.id
									)
								}
							>
								<Icon icon={closeIcon} style={{ fontSize: 16 }} />
							</span>
						)}
					<div className="cards-proposal-back-left">
						<div className="cards-proposal-back-author">
							Author:
							<div className="back-author">
								<span className="back-author-name">{back.author.name}</span>&nbsp;
								( <span className="back-author-email">{back.author.email}</span> )
							</div>
						</div>
						<Back back={back} />
					</div>
				</div>
			);
		});
		return (
			<div className="cards-proposal-back-user">
				<div className="cards-proposal-back-title">From user</div>
				{backs}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		currentProposalCard: state.cardsProposal.currentProposalCard,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onDeclineCurrentBack: (backId, cardId) =>
			dispatch(actions.declineCurrentBack(backId, cardId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(UserCard));
