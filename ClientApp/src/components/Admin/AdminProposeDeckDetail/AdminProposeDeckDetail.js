import React, { Component, Fragment } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MaterialTable from 'material-table';
import './AdminProposeDeckDetail.css';
import Swal from 'sweetalert2';
import AdminPropose from '../AdminPropose/AdminPropose';

class AdminProposeDeckDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			deckData: [],
			redirectCreateDeck: false,
			cardSource: [],
			redirectProposalDashboard: false
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
		this.setState({ deckData: data, loading: false });
	};

	getCardFromDeck = async () => {
		var url = '/api/proposeddecks/' + this.props.match.params.deckId + '/proposals';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({ cardSource: data, loading: false });
	};

	table = () => {
		if (this.state.cardSource.length !== undefined) {
			var data = this.transData(this.state.cardSource);
		}
		var title = 'Proposed cards';
		return (
			<MaterialTable
				title={title}
				columns={[
					// { title: 'ID', field: 'id' },
					{ title: 'Front', field: 'front' },
					{ title: 'Backs', field: 'backs' },	
					{ title: 'Author', field: 'author' }	
				]}
				data={data}
				detailPanel={ rowData => {
					return (
						<div className="back-container">
							<div className="backs-list">
								{ rowData.originBacks.map((back, index) => {
									return (
										<div className="back-item">
											<div className="back-content">
												{ !back.approved ? 
													<Fragment>
														<h6 class="w-auto">
															<span class="badge" style={{ backgroundColor: '#f1f1f1', color: 'rgba(0, 0, 0, 0.6)' }}>
																Not approved
															</span>
														</h6> 
														<span className="delete-back" onClick={() => this.onClickDeleteBack(event, back.id)}>
															<i class="fas fa-times" style={{ fontSize: 12 }}></i>
														</span>
													</Fragment> : '' }
												<div className="back-info">
													<br />
													<p className="back-meaning">{back.meaning}</p>
													<p className="back-type">{back.type}</p>
													<p className="back-example">{back.example}</p>
												</div>
												<img src={back.image ? back.image : ''} className={back.image ? '' : 'd-none'} />
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)
				}}
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
			} catch (error) {
				console.error('Error:', error);
			}
		}
		this.getDeckData();
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
			} catch (error) {
				console.error('Error:', error);
			}
		}
		this.getCardFromDeck();
	};

	transData = param => {
		var mockData = [];
		var oldProposal = Object.create(null);
		var data = param;

		if (data !== undefined) {
			data.map((proposal, index) => {
				oldProposal = {
					id: proposal.id,
					front: proposal.card.front,
					backs: proposal.card.backs.map(back => back.meaning).join(' - '),
					author: proposal.user.name,
					originBacks: proposal.card.backs
				};
				mockData.push(oldProposal);
			});
			return mockData;
		}
	};

	onClickDeleteProposedDeck = async () => {
		Swal.fire({
			title: 'Are you sure to delete this deck?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			cancelButtonColor: '#b3b3b3',
			confirmButtonColor: '#DD3333',
			confirmButtonText: 'Yes, delete it!'
		}).then(result => {
			if (result.value) {
				this.deleteProposedDeck();
			}
		});
	};

	deleteProposedDeck = async () => {
		const url = '/api/proposeddecks/' + this.state.deckData.id;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		if (response.status === 204) {
			this.setState({
				redirectProposalDashboard: true
			});
		}
	};

	onClickDeleteBack = (event, backId) => {
		Swal.fire({
			title: 'Are you sure you want to delete this back?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			cancelButtonColor: '#b3b3b3',
			confirmButtonColor: '#DD3333',
			confirmButtonText: 'Yes, delete it!'
		}).then(result => {
			if (result.value) {
				this.deleteBack(event, backId);
			}
		});
	}

	deleteBack = async (event, backId) => {
		const url = `/api/backs/${backId}`; 
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		})

		if (response.status === 204) {
			let deleteBtn = event.target;
			if (event.target.nodeName.toLowerCase() === 'i') {
				deleteBtn = event.target.parentNode;
			}
	
			const backItem = deleteBtn.parentNode.parentNode;
			const backsList = backItem.parentNode;
			backsList.removeChild(backItem);

			if (backsList.childElementCount === 0) {
				this.getCardFromDeck();
			}
		}
	}

	render() {
		if (this.state.redirectProposalDashboard) {
			return <Redirect to="/admin/propose" Component={AdminPropose} />;
		}

		let date = new Date(this.state.deckData.createdDate);
		let table = this.table();
		return (
			<div>
				<div className="deck-fields">
					<div className="deck-back">
						<Link to="/admin/propose">Back</Link>
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

						{ this.state.deckData.approved === false ?
							<div className="deck-content-advanced">
								<div class="deck-content-advanced-features">
									<div class="deck-title">Features</div>
								</div>
								<div class="deck-content-advanced-features-items">
									<div className="deck-feature">
										<p
											onClick={() => this.onClickDeleteProposedDeck(this.state.deckData.id)}
											style={{ color: 'red', cursor: 'pointer'}}>
											<i class="far fa-trash-alt"></i>Delete this proposed deck
										</p>
									</div>
								</div>
							</div> : ''
						}	
					</div>
					<div className="table">{table}</div>
				</div>
			</div>
		);
	}
}

export default AdminProposeDeckDetail;
