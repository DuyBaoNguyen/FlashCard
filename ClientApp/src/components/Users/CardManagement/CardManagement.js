import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import './CardManagement.css';
import MaterialTable from 'material-table';

class CardManagement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			deckData: {}
		};
	}

	componentWillMount() {
		var deckID = this.getDeckIDFromPath(window.location.pathname);
		console.log(deckID);
		this.setState({
			id: deckID
		});
	}

	componentDidMount() {
		this.getDeckData();
	}

	getDeckIDFromPath = url => {
		return url.substr(7);
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

	transData = () => {
		var mockData = [];
		var oldVocab = Object.create(null);
		var data = this.state.deckData.cards;
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
			console.log(mockData);
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

	table = () => {
		var data = this.transData();
		var title = 'Card in deck: ' + this.state.deckData.name;
		return (
			<MaterialTable
				title={title}
				columns={[
					{ title: 'ID', field: 'id' },
					{ title: 'Front', field: 'front' },
					{ title: 'Backs', field: 'backs' }
				]}
				data={data}
				actions={[
					{
						icon: 'edit',
						tooltip: 'Edit card',
						onClick: (event, rowData) => alert(typeof rowData.id)
					},
					{
						icon: 'delete',
						tooltip: 'Delete card',
						// eslint-disable-next-line no-restricted-globals
						onClick: (event, rowData) => this.deleteCard(rowData.id)
					}
				]}
			/>
		);
	};

	render() {
		var table = this.table();
		return (
			<div>
				<div className="field">{table}</div>
			</div>
		);
	}
}

export default CardManagement;
