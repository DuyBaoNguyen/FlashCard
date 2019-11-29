import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import MaterialTable from 'material-table';
import Dashboard from '../Dashboard/Dashboard';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import EditCard from '../EditCard/EditCard';


import './AddCards.css';

class AddCards extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			deckData: {},
			cardSource: {},
			redirectAddCards: false,
			redirectEditCard: false,
		};
	}

	componentWillMount() {
		var deckID = this.getDeckIDFromPath();
		console.log(deckID);
		this.setState({
			id: deckID
		});
	}

	componentDidMount() {
		this.getDeckData();
		this.getCardSource();
	}

	getDeckIDFromPath = url => {
		return this.props.match.params.deckId;
	};

	getDeckData = async () => {
		var url = '/api/decks/' + this.state.id;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});

		const data = await response.json();

		this.setState({ deckData: data, loading: false });
	};

	getCardSource = async () => {
		var url = '/api/decks/' + this.state.id + '/remainingcards';
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
					backs: vocab.backs.map((back, index2) => {
						return back.meaning;
					})
				};
				mockData.push(oldVocab);
			});
			return mockData;
		}
	};

	deleteCard = async param => {
		var url = '/api/decks/' + this.state.id + '/cards';
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
			// eslint-disable-next-line no-undef
			// eslint-disable-next-line no-restricted-globals
			location.reload();
		}
	};

	editCard = (front) => {
		this.setState({
			front : front,
			redirectEditCard : true
		});
	}

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
			// eslint-disable-next-line no-undef
			// eslint-disable-next-line no-restricted-globals
			location.reload();
		}
	};

	table = () => {
		var data = this.transData(this.state.deckData.cards);
		var title = 'Card in deck: ' + this.state.deckData.name;
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
						icon: 'edit',
						tooltip: 'Edit card',
						onClick: (event, rowData) => this.editCard(rowData.front)
					},
					{
						icon: 'delete',
						tooltip: 'Delete card',
						// eslint-disable-next-line no-restricted-globals
						onClick: (event, rowData) => this.deleteCard(rowData.id)
					}
				]}
				options={{
					pageSize: 7
				}}
			/>
		);
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
            onClick: (event) => this.redirectAddCards()
          },
					{
						icon: 'add',
						tooltip: 'Add card',
						// eslint-disable-next-line no-restricted-globals
						onClick: (event, rowData) => this.addCard(rowData.id)
					}
				]}
				options={{
					pageSize: 7
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
		var table = this.table();
		if (this.state.redirectAddCards === true) {
			return <Redirect to="/createcard" Component={Dashboard} />;
		}
		if (this.state.redirectEditCard === true) {
			return <Redirect to={editCardURL} Component={EditCard} />;
		}
		return (
			<div>
				<a href={ '/decks/' + this.props.match.params.deckId }>Done</a>
				<div className="add-field">
					<div className="deck-table">{table}</div>
					<div className="deck-cards">{cardSource}</div>
				</div>
			</div>
		);
	}
}

export default AddCards;
