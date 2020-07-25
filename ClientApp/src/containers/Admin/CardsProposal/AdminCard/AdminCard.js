import React, { Component } from 'react';
import { connect } from 'react-redux';

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
		let backs = this.props.card.backs.map((back, index) => {
			return (
				<div key={back.id} className="cards-proposal-back-card">
					<div className="cards-proposal-back-meaning">{back.meaning}</div>
					<br />
					<div className="cards-proposal-back-type">{back.type}</div>
					<br />
					<div className="cards-proposal-back-example">{back.example}</div>
				</div>
			);
		});
		return (
			<div className="cards-proposal-back-admin">
				<div className="cards-proposal-back-title">{`${this.props.card.front}`}</div>
				{this.props.card.backs.length === 0 ? blank : backs}
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
