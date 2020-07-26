import React, { Component } from 'react';
import { connect } from 'react-redux';

import Back from '../../../../components/User/Back/Back';
import withErrorHandler from '../../../../hoc/withErrorHandler';
import './AdminCard.css';

class AdminCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	render() {
		let blank = (
			<div className="cards-proposal-back-blank">
				This card has not been in Admin card list yet!
			</div>
		);
		let backs = this.props.card?.backs.map((back, index) => {
			return (
				<div key={back.id} className="cards-proposal-back-card">
					<Back back={back} />
				</div>
			);
		});
		return (
			<div className="cards-proposal-back-admin">
				<div className="cards-proposal-back-title">
					Proposal for&nbsp;
					" <span>{this.props.card?.front}</span> "
				</div>
				{this.props.card?.backs.length === 0 ? blank : backs}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		card: state.card.card,
	};
};

export default connect(mapStateToProps)(withErrorHandler(AdminCard));
