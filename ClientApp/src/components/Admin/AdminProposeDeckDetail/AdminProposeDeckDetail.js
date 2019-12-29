import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MaterialTable from 'material-table';
import './AdminProposeDeckDetail.css';
import Navbar from '../../modules/NavBar/Navbar';
import AdminUsers from '../AdminUsers/AdminUsers';
import Deck from '../../modules/Deck/Deck';

class AdminProposeDeckDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			deckData: [],
			redirectCreateDeck: false,
			cardSource: []
		};
	}

	componentDidMount() {
		this.getDeckData();
		this.getCardFromDeck();
	}

	getDeckData = async () => {
		var url = '/api/proposeddecks/' + this.props.match.params.deckId;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		console.log(data);
		this.setState({ deckData: data, loading: false });
	};

	getCardFromDeck = async () => {
		var url = '/api/proposeddecks/' + this.props.match.params.deckId + '/proposals';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		console.log(data);
		this.setState({ cardSource: data, loading: false });
		console.log(this.state.cardSource);
	};

	table = () => {
		if (this.state.cardSource.length !== undefined) {
			var data = this.transData(this.state.cardSource);
			console.log(data);
		}
		var title = 'Proposed cards';
		return (
			<MaterialTable
				title={title}
				columns={[
					// { title: 'ID', field: 'id' },
					{ title: 'Front', field: 'front' },
					{ title: 'Backs', field: 'back' },		
				]}

				data={data}
				actions={[
					{
						icon: 'check',
						tooltip: 'Approve this card',
						onClick: (event, rowData) => this.approveCard(rowData.id)
					},
					{
						icon: 'clear',
						tooltip: 'Reject this card',
						// eslint-disable-next-line no-restricted-globals
						onClick: (event, rowData) => this.rejectCard(rowData.id)
					}
				]}
				options={{
					pageSize: 5
				}}
			/>
		);
	};

	approveCard = async id => {
		var url = '/api/proposals/' + id;
		const token = await authService.getAccessToken();
		// eslint-disable-next-line no-restricted-globals
		var r = confirm('Are you sure to approve this card?');
		if (r == true) {
			try {
				const response = await fetch(url, {
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});
				const json = await response;
				console.log('Success:', JSON.stringify(json));
			} catch (error) {
				console.error('Error:', error);
			}
		}
		this.getCardFromDeck();
	};

	rejectCard = async id => {
		var url = '/api/proposals/' + id;
		const token = await authService.getAccessToken();
		// eslint-disable-next-line no-restricted-globals
		var r = confirm('Are you sure to reject this card?');
		if (r == true) {
			try {
				const response = await fetch(url, {
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});
				const json = await response;
				console.log('Success:', JSON.stringify(json));
			} catch (error) {
				console.error('Error:', error);
			}
		}
		this.getCardFromDeck();
	};

	transData = param => {
		var mockData = [];
		var oldVocab = Object.create(null);
		var data = param;
		console.log(data);

		if (data !== undefined) {
			data.map((vocab, index) => {
				vocab.card.backs.map(back => {
					oldVocab = {
						front: vocab.card.front,
						id: back.id,
						back: back.meaning,
						author: back.author.displayName
					};
					mockData.push(oldVocab);
				});
			});
			console.log(mockData);
			return mockData;
		}
	};

	render() {
		let date = new Date(this.state.deckData.createdDate);
		let table = this.table();
		return (
			<div>
				<div className="deck-fields">
					<div className="deck-back">
						<Link to="/">Back</Link>
					</div>
					<div className="deck-content">
						<div class="deck-content-info">
							<div class="deck-title">Info</div>
							<div class="deck-content-info-line">
								Deck name: {this.state.deckData.name}
							</div>
							<div class="deck-content-info-line">
								Number of cards: {this.state.deckData.totalCards}
							</div>
							<div class="deck-content-info-line">
								Description: {this.state.deckData.description}
							</div>
							<div class="deck-content-info-line">
								Date created: {date.toLocaleDateString()}
							</div>
							<div class="deck-content-info-line">
								Category:{' '}
								{this.state.deckData.category &&
									this.state.deckData.category.name}
							</div>
							<div class="deck-content-info-line">
								Author:{' '}
								{this.state.deckData.author &&
									this.state.deckData.author.displayName}
							</div>
							<div class="deck-content-info-line">
								Contributors:{' '}
								{this.state.deckData.contributors
									? this.state.deckData.contributors
											.map(cont => cont.displayName)
											.join(', ')
									: ''}
							</div>
						</div>
					</div>
					<div className="table">{table}</div>
				</div>
			</div>
		);
	}
}

export default AdminProposeDeckDetail;
