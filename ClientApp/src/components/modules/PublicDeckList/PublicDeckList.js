import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { Link } from 'react-router-dom';
import PublicDeck from '../PublicDeck/PublicDeck';

class DeckList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			deckData : [],
      redirectCreateDeck : false
    };
    this.getPublicDeckData = this.getPublicDeckData.bind(this);
	}

	componentDidMount() {
    this.getPublicDeckData();
	}
	
	getPublicDeckData = async () => {
		const token = await authService.getAccessToken();
    const response = await fetch('/api/publicdecks', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		if (response.status === 200) {
      const data = await response.json();
			this.setState({ deckData: data, loading: false });
		}
	}

	redirectCreateDeck = () => {
		this.setState({
			redirectCreateDeck : true,
		});
	}

	render() {
		var {deckData} = this.state;
		var element = deckData.map((deck, index) => {
			return <PublicDeck deck={deck} getPublicDeckData={this.getPublicDeckData}/>;
		});
		return (
			<div className="menu">
				<div className="menu-title">
					<h6>{this.props.menuName}</h6>
					<Link to="/proposedeck" className="menu-button">Propose Deck</Link>
				</div>
				<div className="menu-decks">{element}</div>
			</div>
		);
	}
}

export default DeckList;
