import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import MaterialTable from 'material-table';
import Dashboard from '../Dashboard/Dashboard';
import AddCards from '../AddCards/AddCards';

import Button from '@material-ui/core/Button';
import Select from 'react-select';
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom';

import './CreateDeck.css';

class CreateDeck extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			redirectAddCards: false,
			selectedOption: null,
			categories: {},
		};
	}

	componentWillMount() {
		// var deckID = this.getDeckIDFromPath();
		// console.log(deckID);
		// this.setState({
		// 	id: deckID
		// });
	}

	componentDidMount() {
		this.getCategories();
	}

	getDeckIDFromPath = url => {
		return this.props.match.params.deckId;
	};

	getCategories = async () => {
		var url = '/api/categories';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		// console.log(data);
		this.setState({ categories: data, loading: false });
		console.log(this.state.categories);
	};

	createDeck = async () => {
		var deckName = document.getElementById('dname').value;
		var description = document.getElementById('des').value;
		var categories = this.state.selectedOption.value;

		const url = '/api/decks/';
		const token = await authService.getAccessToken();
		const data = {
			name: deckName,
			description: description,
			category: {
				id: categories
			}
		};

		try {
			const response = await fetch(url, {
				method: 'POST', // or 'PUT'
				body: JSON.stringify(data), // data can be `string` or {object}!
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			const json = await response.json();
			console.log('Success:', JSON.stringify(json.id));
			this.setState({
				id : JSON.stringify(json.id),
				redirectAddCards : true,
			});
		} catch (error) {
			console.error('Error:', error);
		}
	};

	handleChange = selectedOption => {
		this.setState({ selectedOption }, () =>
			console.log(`Option selected:`, this.state.selectedOption)
		);
	};

	transData = () => {
		var array = [];
		var cate = Object.create(null);
		var categoriesList = this.state.categories;
		if (categoriesList !== undefined) {
			categoriesList.map(category => {
				cate = {
					value: category.id,
					label: category.name
				};
				array.push(cate);
			});
		}
		console.log(array);
		return array;
	};

	render() {
		var categories;
		var url;
		const { selectedOption } = this.state;
		if (this.state.redirectAddCards === true) {
			url = "/addcards/" + this.state.id;
			return <Redirect to={url} Component={AddCards} />;
		}
		if (this.state.categories.length !== undefined) {
			categories = this.transData();
			console.log(categories);
		}
		return (
			<div>
				<Link to="/">Back</Link>
				<div className="add-deck-field">
					<div className="field-content">
						<form action="/action_page.php">
							<label for="fname">Category</label>
							<Select
								className="select"
								value={selectedOption}
								onChange={this.handleChange}
								options={categories}
							/>
							<hr />
							<label for="fname">Deck name</label>
							<input type="text" id="dname" name="dname" />
							<label for="lname">Description</label>
							<input type="text" id="des" name="des" />

							<Button
								className="button-submit"
								onClick={this.createDeck}
								type="button"
								color="primary"
							>
								<p>Create</p>
							</Button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default CreateDeck;
