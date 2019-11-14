/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';

import './Deck.css';

class Deck extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false
		};
	}

	render() {
		return (
			<div className="menu-deck">
				<div className="menu-deck-info">
					<h6>{ this.props.deck.deckName }</h6>

					<div className="menu-deck-info-line">
						<img src="../../../images/icons/card.svg" width="21px" height="16px" />
						<p>{ this.props.deck.cardNumber }</p>
					</div>
					<div className="menu-deck-info-line">
						<img src="../../../images/icons/calendar.svg" width="21px" height="16px" />
						<p>{ this.props.deck.date }</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Deck;
