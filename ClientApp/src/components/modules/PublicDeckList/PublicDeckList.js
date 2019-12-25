import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import CreateDeck from '../../Users/CreateDeck/CreateDeck';

// import './DeckList.css';
import PublicDeck from '../PublicDeck/PublicDeck';

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
    this.getPublicDeckData();
	}
	
	getPublicDeckData = async () => {
		const token = await authService.getAccessToken();
    const response = await fetch('/api/publicdecks', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		if (response.status === 200) {
      const data = await response.json();
      console.log(data);
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
			return <PublicDeck deck={deck}/>;
		});
		// if (this.state.redirectCreateDeck === true) {
		// 	return <Redirect to='/createdeck' Component={CreateDeck} />
		// }
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
