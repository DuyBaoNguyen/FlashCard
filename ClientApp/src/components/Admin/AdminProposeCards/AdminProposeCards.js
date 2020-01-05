import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MaterialTable from 'material-table';
import './AdminProposeCards.css';
import Navbar from '../../modules/NavBar/Navbar';
import AdminUsers from '../AdminUsers/AdminUsers';
import Swal from 'sweetalert2';

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
				detailPanel={ rowData => {
					return (
						<div className="back-container">
							<div className="backs-list">
								<div className="back-item">
									<div className="back-content">
										<div className="back-info">
											<br />
											<p className="back-meaning">{rowData.originBack.meaning}</p>
											<p className="back-type">{rowData.originBack.type}</p>
											<p className="back-example">{rowData.originBack.example}</p>
										</div>
										<img src={rowData.originBack.image ? rowData.originBack.image : ''}
											className={rowData.originBack.image ? '' : 'd-none'} />
									</div>
								</div>
							</div>
						</div>
					)
				}}
				actions={[
					{
						icon: 'check',
						tooltip: 'Approve this card',
						onClick: (event, rowData) => this.onClickApproveCard(rowData.id)
					},
					{
						icon: 'clear',
						tooltip: 'Reject this card',
						// eslint-disable-next-line no-restricted-globals
						onClick: (event, rowData) => this.onClickRejectCard(rowData.id)
					}
				]}
				options={{
					pageSize: 9
				}}
			/>
		);
	};

	onClickApproveCard = id => {
		Swal.fire({
			title: 'Are you sure to approve this card?',
			icon: 'warning',
			showCancelButton: true,
			cancelButtonColor: '#b3b3b3',
			confirmButtonColor: '#007bff',
			confirmButtonText: 'OK'
		}).then(result => {
			if (result.value) {
				this.approveCard(id);
			}
		});
	}

	approveCard = async id => {
		var url = '/api/proposedbacks/' + id;
		const token = await authService.getAccessToken();
		// eslint-disable-next-line no-restricted-globals
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (response.status === 204) {
			this.getProposedCards();
		}
	};

	onClickRejectCard = id => {
		Swal.fire({
			title: 'Are you sure to reject this card?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			cancelButtonColor: '#b3b3b3',
			confirmButtonColor: '#dd3333',
			confirmButtonText: 'Yes, reject it!'
		}).then(result => {
			if (result.value) {
				this.rejectCard(id);
			}
		});
	}

	rejectCard = async id => {
		var url = '/api/proposedbacks/' + id;
		const token = await authService.getAccessToken();
		// eslint-disable-next-line no-restricted-globals
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (response.status === 204) {
			this.getProposedCards();
		}
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
						author: back.author.displayName,
						originBack: back
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
