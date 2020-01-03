import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Switch from 'react-switch';
import './DeckDetail.css';
import Info from '../../modules/Info/Info';
import Testing from '../Testing/Testing';
import AddCards from '../AddCards/AddCards';
import MaterialTable from 'material-table';
import Dashboard from '../Dashboard/Dashboard';
import EditCard from '../EditCard/EditCard';
import classnames from 'classnames';

class DeckDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: null,
			role: '',
			id: '',
			deckData: {},
			front: '',
			statisticsData: {},
			redirectTesting: false,
			redirectAddCards: false,
			redirectDashboard: false,
			redirectEditCard: false
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
		this.getStatistics();
		this.getCurrentUser();
	}

	getDeckIDFromPath = () => {
		return this.props.match.params.deckId;
	};

	getDeckData = async () => {
		var url = '/api/decks/' + this.state.id;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		console.log(token);
		this.setState({ deckData: data, loading: false, checked: data.public });
	};

	getCurrentUser = async () => {
		var url = '/api/currentuser';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();

		this.setState({ role: data.role });
		console.log(this.state.role);
	};

	getStatistics = async () => {
		var url = '/api/statistics/' + this.state.id;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({ statisticsData: data, loading: false });
		console.log(data);
	};

	redirectTesting = () => {
		this.setState({
			redirectTesting: true
		});
	};

	redirectAddCards = () => {
		this.setState({
			redirectAddCards: true
		});
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
					backs: vocab.backs
						.map((back, index2) => {
							// if (!back.fromAdmin) {
							// 	return back.meaning;
							// }
							// return back.meaning + 'From admin';
							return back.meaning;
						})
						.join(' - '),
					originBacks: vocab.backs
				};
				mockData.push(oldVocab);
			});
			// console.log(mockData);
			return mockData;
		}
	};

	onClickDeleteDeck = async param => {
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
				this.deleteDeck(param);
			}
		});
	};

	deleteCard = async param => {
		var url = '/api/decks/' + this.state.id + '/cards';
		const token = await authService.getAccessToken();
		const data = '[' + param.toString() + ']';
		try {
			const response = await fetch(url, {
				method: 'DELETE',
				body: data,
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
		this.getDeckData();
		this.getStatistics();
	};

	deleteDeck = async param => {
		var url = '/api/decks/' + this.state.id;
		const token = await authService.getAccessToken();
		// eslint-disable-next-line no-restricted-globals
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
		// eslint-disable-next-line no-undef
		// eslint-disable-next-line no-restricted-globals
		this.setState({
			redirectDashboard: true
		});
	};

	editCard = front => {
		this.setState({
			front: front,
			redirectEditCard: true
		});
	};

	handleChange = checked => {
		this.setState({ checked });
		this.updatePublic(checked);
	};

	updatePublic = async(checked) => {
		var url = '/api/decks/' + this.state.id;
		const token = await authService.getAccessToken();
		const data = {
			name: this.state.deckData.name,
			description: this.state.deckData.description,
			category: {
				id: this.state.deckData.category.id
			},
			public: checked
		}
		
		try {
			const response = await fetch(url, {
				method: 'PUT',
				body: JSON.stringify(data),
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
	table = () => {
		var data = this.transData();
		var title = 'Cards';
		return (
			<MaterialTable
				title={title}
				columns={[
					// { title: 'ID', field: 'id' },
					{ title: 'Front', field: 'front' },
					{ title: 'Backs', field: 'backs' }
				]}
				data={data}
				detailPanel={rowData => {
					return (
						<div className="back-container">
							<div className="backs-list">
								{ rowData.originBacks.map((back, index) => {
									return (
										<div className="back-item">
											<div className="back-content">
												{ back.fromAdmin ? <h6 class="w-auto"><span class="badge badge-success">From Admin</span></h6> : '' }
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
						icon: 'edit',
						tooltip: 'Edit card',
						onClick: (event, rowData) => this.editCard(rowData.front)
					},
					{
						icon: 'delete',
						tooltip: 'Remove card from deck',
						// eslint-disable-next-line no-restricted-globals
						onClick: (event, rowData) => this.deleteCard(rowData.id)
					},
					{
						icon: 'add',
						tooltip: 'Add Cards',
						isFreeAction: true,
						onClick: event => this.redirectAddCards()
					}
				]}
			/>
		);
	};

	render() {
		// console.log(this.props.match.params.deckId);
		// console.log();
		var date = new Date(this.state.deckData.createdDate);
		var testURL = '/testing/' + this.state.id.toString();
		var addCardsURL = '/addcards/' + this.state.id.toString();
		var editCardURL = '/editcard/' + this.state.front;
		let info;
		if (!!this.state.role && this.state.role === 'user') {
			info = <Info data={this.state.statisticsData != undefined ? this.state.statisticsData : null} />
		}

		if (this.state.redirectTesting === true) {
			return <Redirect to={testURL} Component={Testing} />;
		}

		if (this.state.redirectAddCards === true) {
			return <Redirect to={addCardsURL} Component={AddCards} />;
		}

		if (this.state.redirectDashboard === true) {
			return <Redirect to="/" Component={Dashboard} />;
		}

		if (this.state.redirectEditCard === true) {
			return <Redirect to={editCardURL} Component={EditCard} />;
		}

		var table = this.table();
		return (
			<div>
				<div className="deck-fields">
					<div className="deck-back">
						<Link to="/">Back</Link>
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
								Category: {this.state.deckData.category && this.state.deckData.category.name}
							</div>
							<div class="deck-content-info-line">
								Author: {this.state.deckData.author && this.state.deckData.author.displayName}
							</div>
							<div class="deck-content-info-line">
								Contributors: { this.state.deckData.contributors ? 
									this.state.deckData.contributors.map((cont) => cont.displayName).join(', ') : ''
								}
							</div>
						</div>
						{/* <Info className={classnames(
										this.state.role === 'administrator' ? 'none-display' : ''
									)}
							data={
								this.state.statisticsData != undefined
									? this.state.statisticsData
									: null
							}
						/> */}
						{info}
						<div className="deck-content-advanced">
							<div class="deck-content-advanced-features">
								<div class="deck-title">Features</div>
							</div>
							<div class="deck-content-advanced-features-items">
								<p onClick={this.onClickDeleteDeck} style={{ color: 'red' }}>
									<i class="far fa-trash-alt"></i>Delete deck
								</p>
								<p onClick={this.onClickEditDeck} style={{ color: '#007bff' }}>
									<i class="far fa-edit"></i> 
									<Link to={'/editdeck/' + this.state.id} style={{ color: '#007bff' }}>Edit deck</Link>
								</p>
								<div
									className={classnames(
									this.state.role === 'user' ? 'none-display' : 'public',
									)}
									style={{ color: "#007bff" }}
								>
									<i class="far fa-arrow-from-bottom"></i>
									Publicize deck 
									<Switch
									className='switch'
										onChange={this.handleChange}
										checked={this.state.checked}
									/>
								</div>
								<div
									className={classnames(
										'deck-button',
										this.state.role === 'administrator' ? 'none-display' : '',
										this.state.deckData.totalCards !== 0 ? '' : 'none-display'
									)}
									onClick={this.redirectTesting}
								>
									<p>Review</p>
								</div>
							</div>
							{/* <div class="deck-content-advanced-share">
								<div class="deck-title">Share deck</div>
								<div class="switch">
									<FormGroup row>
										<FormControlLabel
											control={<Switch value="checkedA" color="primary" />}
											label="Secondary"
										/>
									</FormGroup>
								</div>
							</div> */}
						</div>
					</div>
					<div className="table">{table}</div>
				</div>
			</div>
		);
	}
}

export default DeckDetail;
