import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler';
import * as actions from '../../../../store/actions/index';

import './UserCard.css';

class UserCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	render() {
		let backs = this.props.currentProposalCard.backs.map((back, index) => {
			return (
				<div className="cards-proposal-back-card">
					<div className="cards-proposal-back-meaning">{back.meaning}</div>
					<br />
					<div className="cards-proposal-back-type">{back.type}</div>
					<br />
					<div className="cards-proposal-back-example">{back.example}</div>
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
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(UserCard));
