import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import MaterialTable from 'material-table';
import Dashboard from '../Dashboard/Dashboard';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';

import './EditCard.css';

class EditCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			front: this.props.match.params.front,
			cardData: {},
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
			]
		};
	}

	componentDidMount() {
		this.getCardData();
	}

	getCardData = async () => {
		var url = '/api/cards/' + this.state.front;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});

		const data = await response.json();

		this.setState({ cardData: data, loading: false });
		console.log(data.backs);
	};

	table = () => {
		console.log(this.state.cardData.backs);
		return (
			<MaterialTable
				title="Editable Preview"
				columns={this.state.columns}
				data={this.state.cardData.backs}
				editable={{
					onRowAdd: newData =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								{
									const data = this.state.data;
									data.push(newData);
									this.setState({ data }, () => resolve());
								}
								resolve();
							}, 1000);
						}),
					onRowUpdate: (newData, oldData) =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								{
									const cardData = this.state.cardData;
									const index = cardData.indexOf(oldData);
									cardData[index] = newData;
									this.setState({ cardData }, () => resolve());
								}
								resolve();
							}, 1000);
						}),
					onRowDelete: oldData =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								{
									let cardData = this.state.cardData;
									const index = cardData.indexOf(oldData);
									cardData.splice(index, 1);
									this.setState({ cardData }, () => resolve());
								}
								resolve();
							}, 1000);
						})
				}}
			/>
		);
	};

	render() {
		var table = this.table();
		return (
			<div className="create-cards">
				{/* <a href="#">Done</a> */}
				<div className="create-cards-front">
					<label for="fname">Front</label>
					<input
						type="text"
						id="frontSide"
						name="dname"
						value={
							this.state.cardData.front != undefined
								? this.state.cardData.front.toString()
								: ''
						}
					/>
				</div>
				<br />
					<div className="create-cards-back">{table}</div>
			</div>
		);
	}
}

export default EditCard;
