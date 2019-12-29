/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Link,
	Redirect,
	withRouter
} from 'react-router-dom';
import AdminProposeDeckDetail from '../../Admin/AdminProposeDeckDetail/AdminProposeDeckDetail';
import CardIcon from '../../../images/icons/card.svg';
import DateIcon from '../../../images/icons/calendar.svg';

import './ProposedDeck.css';

class ProposedDeck extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectProposedDeckDetail : false,
		};
	}

	// redirectDeckDetails = () => {
	// 	this.setState({
	// 		redirect: true
	// 	});
	// };

	redirectProposedDeckDetail = () => {
		this.setState({
			redirectProposedDeckDetail : true,
		});
	}

	render() {
		var deckURL = '/decks/' + this.props.deck.id;
		var date = new Date(this.props.deck.createdDate);
		let fromAdminLabel;
		let url = '/admin/propose/' + this.props.deck.id;
		if (this.state.redirectProposedDeckDetail === true) {
			return <Redirect to={url} Component={AdminProposeDeckDetail} />
		}
		if (this.props.deck.fromAdmin) {
			fromAdminLabel = <h6 class="w-auto"><span class="badge badge-success">From Admin</span></h6>
		}

		// if (this.state.redirect === true) {
		// 	return <Redirect to={deckURL} Component={DeckDetail} />;
		// }
		return (
			<Link to={url} className="text-decoration-none flex-item">
				<div className="menu-deck">
					<div className="menu-deck-info">
						<div class="d-flex justify-content-between align-content-center">
							<h6 class="w-auto">{this.props.deck.name}</h6>
							{fromAdminLabel}
						</div>
						<hr />
						<div className="menu-deck-info-line">
							<img className="icons"
								src={CardIcon} width="21px" height="16px" />
							<p>{this.props.deck.totalCards}</p>
						</div>
						<div className="menu-deck-info-line">
							<img className="icons" src={DateIcon} width="21px" height="16px" />
							<p>{date.toLocaleDateString()}</p>
						</div>
					</div>
				</div>
			</Link>
		);
	}
}

export default ProposedDeck;
