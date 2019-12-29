import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MaterialTable from 'material-table';
import './AdminProposeDecks.css';
import ProposedDeck from '../../modules/ProposedDeck/ProposedDeck';

class AdminProposeDecks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			deckData : [],
			redirectProposedDeckDetail : false,
		};
	}

	componentDidMount() {
    this.getDeckData();
	}
	
	getDeckData = async () => {
		const token = await authService.getAccessToken();
    const response = await fetch('/api/proposeddecks/', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		if (response.status === 200) {
			const data = await response.json();
			this.setState({ deckData: data, loading: false });
		}
	}

	redirectProposedDeckDetail = () => {
		this.setState({
			redirectProposedDeckDetail : true,
		});
	}

	render() {
		var {deckData} = this.state;
		var element = deckData.map((deck, index) => {
			return <ProposedDeck deck={deck}/>;
		});
		return (
			<div className="menu">
				<div className="menu-title">
					<h6>Proposed Decks</h6>
					<div className="menu-button" onClick={this.redirectProposedDeckDetail}>
						{ this.props.addButton === "true" ? <p>Add</p> : "" }
					</div>
				</div>
				<div className="menu-decks">{element}</div>
			</div>
		);
	}
}

export default AdminProposeDecks;
