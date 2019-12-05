import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import MaterialTable from 'material-table';
import Select from 'react-select';
import Button from '@material-ui/core/Button';

import './EditCard.css';

var array = [];
class EditCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			cardSource : [],
			cardData: [],
			redirectAddCards: false,
			selectedOption: null,
			type: [
				{ value: 'noun', label: 'Noun' },
				{ value: 'verb', label: 'Verb' },
				{ value: 'adjective', label: 'Adjective' },
				{ value: 'adverb', label: 'Adverb' },
				{ value: 'preposition', label: 'Prepositionn' }
			]
		};
	}

	// componentWillMount() {

	// }

	componentDidMount() {
		this.getCard();
		this.updateCard(this.props.match.params.front);
	}

	getCard = async () => {
		var url = '/api/cards/' + this.props.match.params.front;
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

	updateCard = async front => {
		var url = '/api/cards/' + front;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();

		this.setState({ cardData: data, loading: false });
		console.log(this.state.cardData);
		// console.log(this.state.categories);
		console.log(url);
	};

	addCard = async param => {
		var url = '/api/cards';
		const token = await authService.getAccessToken();
		const data = {
			front: document.getElementById('front').value,
			back: {
				type: this.state.selectedOption.value,
				meaning: document.getElementById('meaning').value,
				example: document.getElementById('example').value
			}
		};
		// console.log(JSON.stringify(data));
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
				cardData: array
			});
			// console.log(this.state.cardData);
			this.updateCard(document.getElementById('front').value);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	handleChange = selectedOption => {
		this.setState({ selectedOption }, () =>
			console.log(`Option selected:`, this.state.selectedOption)
		);
	};

	onChange = param => {
		console.log(param);
	};

	deleteBack = async param => {
		var url = '/api/backs/' + param;
		console.log(url);
		const token = await authService.getAccessToken();

		if (this.state.cardData.backs.length === 1) {
			alert(
				'This is the last back side of the word. If you want to delete it, please remove this card!'
			);
			return null;
		} else {
			this.updateCard(document.getElementById('front').value);
		}

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
			// console.log(this.state.cardData);
		} catch (error) {
			console.error('Error:', error);
		}
	
	};

	render() {
		let front;
		if (this.state.cardData.backs !== undefined) {
			console.log(this.state.cardData);
			front = this.state.cardData.front;
			var backSide = this.state.cardData.backs.map(back => {
				return (
					<div
						className="content-back-side"
						onClick={() => this.deleteBack(back.id)}
					>
						<p className="meaning">{back.meaning}</p>
						<p className="type">{back.type}</p>
						<p className="example">{back.example}</p>
						<p className="image">{back.image}</p>
					</div>
				);
			});
		}
		const { selectedOption } = this.state;
		return (
			<div>
				<div className="deck-back">
					<a href="/">Back</a>
				</div>
				<div className="create-cards">
					{/* <a href="#">Done</a> */}
					<div className="create-cards-info">
						<label for="fname">Front</label>
						<input
							disabled
							type="text"
							id="front"
							name="dname"
							defaultValue={this.state.cardSource !== undefined ? this.state.cardSource.front : ""}
						/>
						<hr />
						<label for="fname">Category</label>
						<Select
							className="select"
							id="categories"
							value={selectedOption}
							onChange={this.handleChange}
							options={this.state.type}
						/>
						<br />
						<label for="fname">Meaning</label>
						<input type="text" id="meaning" name="dname" />
						<label for="fname">Example</label>
						<input type="text" id="example" name="dname" />
						<hr />
						<Button
							className="button-submit"
							onClick={this.addCard}
							type="button"
							color="primary"
						>
							<p>Add</p>
						</Button>
					</div>
					<hr />
					<div className="create-cards-backside">{backSide}</div>
				</div>
			</div>
		);
	}
}

export default EditCard;
