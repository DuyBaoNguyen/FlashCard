import React, { Component } from 'react';

import './DeckList.css';
import Deck from '../Deck/Deck';

var decks = [
	{
		deckName: '123',
		cardNumber: 123,
		date: 'Oct 17th, 2019'
	},
	{
		deckName: 'test',
		cardNumber: 23,
		date: 'Oct 17th, 2019'
	},
	{
		deckName: 'test',
		cardNumber: 12,
		date: 'Oct 17th, 2019'
	}
];

class DeckList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false
		};
	}

	render() {
		var element = decks.map((deck, index) => {
			return <Deck deck={deck} />;
		});
		return (
			<div className="menu">
				<div className="menu-title">
					<h6>{this.props.menuName}</h6>
					<div className="menu-button">
						{ this.props.addButton === "true" ? <p>Add</p> : "" }
					</div>
				</div>
				<div className="menu-decks">{element}</div>
			</div>
		);
	}
}

export default DeckList;
