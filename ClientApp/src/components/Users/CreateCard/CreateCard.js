import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import MaterialTable from 'material-table';
import Dashboard from '../Dashboard/Dashboard';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';

import './CreateCard.css';


var array = [];
class CreateCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			cardData: [],
			cardSource: {},
			redirectAddCards: false,
			columns: [
				{
					title: 'Type',
					field: 'type',
					lookup: {
						noun: 'noun',
						verb: 'verb',
						adjective: 'adjective',
						adverb: 'adverb',
						preposition: 'preposition'
					}
				},
				{ title: 'Meaning', field: 'meaning' },
				{
					title: 'Example',
					field: 'example',
					initialEditValue: 'initial edit value'
				}
			],
			data: [
				{ "meaning": 'Mehmet', "type": 'Baran', "example": '1987' },
				{ "meaning": 'Mehmet', "type": 'Baran', "example": '1987' }

			]
		};
	}

	// componentWillMount() {
	// 	var deckID = this.getDeckIDFromPath();
	// 	console.log(deckID);
	// 	this.setState({
	// 		id: deckID
	// 	});
	// }

	// componentDidMount() {
	// 	this.getDeckData();
	// 	this.getCardSource();
	// }

	// getDeckIDFromPath = url => {
	// 	return this.props.match.params.deckId;
	// };

	// getDeckData = async () => {
	// 	var url = '/api/decks/' + this.state.id;
	// 	const token = await authService.getAccessToken();
	// 	const response = await fetch(url, {
	// 		headers: !token ? {} : { Authorization: `Bearer ${token}` }
	// 	});

	// 	const data = await response.json();

	// 	this.setState({ deckData: data, loading: false });
	// };

	getCard = async () => {
		var url = '/api/decks/' + document.getElementById("front").value;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});

		const data = await response.json();

		this.setState({ cardSource: data, loading: false });
		console.log(this.state.cardSource);
	};

	// deleteBack = async param => {
	// 	var url = '/api/decks/' + this.state.id + '/cards';
	// 	const token = await authService.getAccessToken();
	// 	const data = '[' + param.toString() + ']';
	// 	// eslint-disable-next-line no-restricted-globals
	// 	var r = confirm('Are you sure to delete this card?');
	// 	if (r == true) {
	// 		try {
	// 			const response = await fetch(url, {
	// 				method: 'DELETE',
	// 				body: data, // data can be `string` or {object}!
	// 				headers: {
	// 					Authorization: `Bearer ${token}`,
	// 					'Content-Type': 'application/json'
	// 				}
	// 			});
	// 			const json = await response;
	// 			console.log('Success:', JSON.stringify(json));
	// 		} catch (error) {
	// 			console.error('Error:', error);
	// 		}
	// 		// eslint-disable-next-line no-undef
	// 		// eslint-disable-next-line no-restricted-globals
	// 		location.reload();
	// 	}
	// };

	addCard = async param => {
		var url = '/api/cards';
		const token = await authService.getAccessToken();
		const data = {
			front : document.getElementById('frontSide').value,
			back: {
				type: param.type,
				meaning: param.meaning,
				example: param.example
			}
		};
		console.log(JSON.stringify(data));
		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data), // data can be `string` or {object}!
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			const json = await response;
			console.log('Success:', JSON.stringify(json));
			array.push(data.back);
			this.setState({
				cardData : array,
			})
			console.log(this.state.cardData);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	table = () => {
		// var data = this.transData(this.state.deckData.cards);
		// var title = 'Card in deck: ' + this.state.deckData.name;
		if (this.state.cardData.length != undefined) {
			console.log(this.state.cardData);
		}
		return (
			<MaterialTable
				title="Backs"
				columns={this.state.columns}
				data={this.state.cardData}
				editable={{
					onRowAdd: newData =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								{
									const data = this.state.data;
									data.push(newData);
									console.log(newData);
									this.addCard(newData);
									this.setState({ data }, () => resolve());
								}
								resolve();
							}, 1000);
						}),
					onRowUpdate: (newData, oldData) =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								{
									const data = this.state.data;
									const index = data.indexOf(oldData);
									data[index] = newData;
									this.setState({ data }, () => resolve());
								}
								resolve();
							}, 1000);
						}),
					onRowDelete: oldData =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								{
									let data = this.state.data;
									const index = data.indexOf(oldData);
									data.splice(index, 1);
									this.setState({ data }, () => resolve());
								}
								resolve();
							}, 1000);
						})
				}}
			/>
		);
	};

	// redirectAddCards = () => {
	// 	this.setState({
	// 		redirectAddCards: true
	// 	});
	// };

	onChange = (param) => {
		console.log(param);
	}

	render() {
		var table = this.table();
		return (
			<div className="create-cards">
				{/* <a href="#">Done</a> */}
				<div className="create-cards-front">
					<label for="fname">Front</label>
					<input type="text" id="frontSide" name="dname" />
				</div>
				<br />
				<div className="create-cards-back">{table}</div>
			</div>
		);
	}
}

export default CreateCard;
