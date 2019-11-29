import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import CreateDeck from '../../Users/CreateDeck/CreateDeck';

import './DeckList.css';
import Deck from '../Deck/Deck';

class DeckList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			deckData : [],
			redirectCreateDeck : false,
		};
	}

	componentDidMount() {
    this.getDeckData();
	}
	
	getDeckData = async () => {
		const token = await authService.getAccessToken();
    const response = await fetch('/api/decks/', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
		const data = await response.json();
    this.setState({ deckData: data, loading: false });
	}

	redirectCreateDeck = () => {
		this.setState({
			redirectCreateDeck : true,
		});
	}

	render() {
		var {deckData} = this.state;
		var element = deckData.map((deck, index) => {
			return <Deck deck={deck}/>;
		});
		if (this.state.redirectCreateDeck === true) {
			return <Redirect to='/createdeck' Component={CreateDeck} />
		}
		return (
			<div className="menu">
				<div className="menu-title">
					<h6>{this.props.menuName}</h6>
					<div className="menu-button" onClick={this.redirectCreateDeck}>
						{ this.props.addButton === "true" ? <p>Add</p> : "" }
					</div>
				</div>
				<div className="menu-decks">{element}</div>
			</div>
		);
	}
}

export default DeckList;
