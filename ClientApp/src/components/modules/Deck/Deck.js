/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Link,
	Redirect,
	withRouter
} from 'react-router-dom';
import DeckDetail from '../../Users/DeckDetail/DeckDetail';

import './Deck.css';

class Deck extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false
		};
	}

	redirectDeckDetails = () => {
		this.setState({
			redirect: true
		});
	};

	render() {
		var deckURL = '/decks/' + this.props.deck.id;
		var date = new Date(this.props.deck.createdDate);
		if (this.state.redirect === true) {
			return <Redirect to={deckURL} Component={DeckDetail} />;
		}
		return (
			<div className="menu-deck" onClick={this.redirectDeckDetails}>
				<div className="menu-deck-info">
					<h6>{ this.props.deck.name }</h6>
					<hr/>
					<div className="menu-deck-info-line">
						<img src="../../../images/icons/card.svg" width="21px" height="16px" />
						<p>{ this.props.deck.totalCards }</p>
					</div>
					<div className="menu-deck-info-line">
						<img src="../../../images/icons/calendar.svg" width="21px" height="16px" />
						<p>{ date.toLocaleDateString() }</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Deck;
