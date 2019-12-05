import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import MaterialTable from 'material-table';
import Dashboard from '../Dashboard/Dashboard';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import EditCard from '../EditCard/EditCard';
import { hashHistory } from 'react-router';

import './CardManagement.css';

class CardManagement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			deckData: {},
			cardSource: {},
			redirectAddCards: false,
			redirectEditCard: false
		};
	}

	componentWillMount() {

	}

	componentDidMount() {
		this.getCardSource();
	}

	getCardSource = async () => {
		var url = '/api/cards';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});

		const data = await response.json();

		this.setState({ cardSource: data, loading: false });
	};

	transData = param => {
		var mockData = [];
		var oldVocab = Object.create(null);
		var data = param;
		if (data != undefined) {
			data.map((vocab, index) => {
				oldVocab = {
					id: vocab.id,
					front: vocab.front,
					backs: vocab.backs
						.map((back, index2) => {
							if (!back.fromAdmin) {
								return back.meaning;
							}
							return back.meaning + 'From admin';
						})
						.join(' - ')
				};
				mockData.push(oldVocab);
			});
			return mockData;
		}
	};

	removeCard = async param => {
		var url = '/api/decks/' + this.state.id + '/cards';
		const token = await authService.getAccessToken();
		const data = '[' + param.toString() + ']';
		// eslint-disable-next-line no-restricted-globals
		var r = confirm('Are you sure to remove this card from deck?');
		if (r == true) {
			try {
				const response = await fetch(url, {
					method: 'DELETE',
					body: data, // data can be `string` or {object}!
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
			this.getCardSource();
			this.getDeckData();
		}
	};

	deleteCard = async param => {
		var url = '/api/cards/' + param;
		const token = await authService.getAccessToken();
		const data = '[' + param.toString() + ']';
		// eslint-disable-next-line no-restricted-globals
		var r = confirm('Are you sure to delete this card?');
		if (r == true) {
			try {
				const response = await fetch(url, {
					method: 'DELETE',
					body: data, // data can be `string` or {object}!
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
			this.getCardSource();
		}
	};

	editCard = front => {
		this.setState({
			front: front,
			redirectEditCard: true
		});
	};

	addCard = async param => {
		var url = '/api/decks/' + this.state.id + '/cards';
		const token = await authService.getAccessToken();
		const data = '[' + param.toString() + ']';

		// eslint-disable-next-line no-restricted-globals
		var r = confirm('Are you sure to add this card?');

		if (r == true) {
			try {
				const response = await fetch(url, {
					method: 'PUT',
					body: data, // data can be `string` or {object}!
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
			this.getCardSource();
		}
	};

	cardSource = () => {
		if (this.state.cardSource.length !== undefined) {
			var data = this.transData(this.state.cardSource);
			console.log(this.state.cardSource);
		}
		var title = 'Card source';
		return (
			<MaterialTable
				title={title}
				columns={[
					// { title: 'ID', field: 'id' },
					{ title: 'Front', field: 'front' },
					{ title: 'Backs', field: 'backs' }
				]}
				data={data}
				actions={[
					{
						icon: 'add',
						tooltip: 'Add Cards',
						isFreeAction: true,
						onClick: event => this.redirectAddCards()
					},
					{
						icon: 'edit',
						tooltip: 'Edit card',
						onClick: (event, rowData) => this.editCard(rowData.front)
					},
					{
						icon: 'delete',
						tooltip: 'Delete card',
						// eslint-disable-next-line no-restricted-globals
						onClick: (event, rowData) => this.deleteCard(rowData.front)
					}
				]}
				options={{
					pageSize: 10
				}}
			/>
		);
	};

	redirectAddCards = () => {
		this.setState({
			redirectAddCards: true
		});
	};

	render() {
		var editCardURL = '/editcard/' + this.state.front;
		var cardSource = this.cardSource();
		if (this.state.redirectAddCards === true) {
			return <Redirect to="/createcard" Component={Dashboard} />;
		}
		if (this.state.redirectEditCard === true) {
			return <Redirect to={editCardURL} Component={EditCard} />;
		}
		return (
			<div>
				<div className="card-management">
					<div className="deck-cards">{cardSource}</div>
				</div>
			</div>
		);
	}
}

export default CardManagement;
