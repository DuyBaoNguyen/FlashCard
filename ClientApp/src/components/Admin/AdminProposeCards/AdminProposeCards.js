import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MaterialTable from 'material-table';
import './AdminProposeCards.css';
import Navbar from '../../modules/NavBar/Navbar';
import AdminUsers from '../AdminUsers/AdminUsers';

class AdminProposeCards extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cardSource: {}
		};
	}

	componentDidMount() {
		this.getProposedCards();
	}

	cardSource = () => {
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
					{ title: 'Author', field: 'author' },				
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
		var url = '/api/proposedbacks/' + id;
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
		this.getProposedCards();
	};

	rejectCard = async id => {
		var url = '/api/proposedbacks/' + id;
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
		this.getProposedCards();
	};

	getProposedCards = async () => {
		var url = '/api/proposedcards';
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
				// oldVocab = {

				// };
				vocab.backs.map(back => {
					oldVocab = {
						front: vocab.front,
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
		var cardSource = this.cardSource();
		return (
			<div>
				<div className="card-management">
					<div className="deck-cards">{cardSource}</div>
				</div>
			</div>
		);
	}
}

export default AdminProposeCards;
