import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import MaterialTable from 'material-table';
import Dashboard from '../Dashboard/Dashboard';
import Swal from 'sweetalert2';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import EditCard from '../EditCard/EditCard';
import { hashHistory } from 'react-router';
import Icon from '@material-ui/core/Icon';

import './PublicCard.css';
import ProposeCard from '../ProposeCard/ProposeCard';

class PublicCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			deckData: {},
			cardSource: {},
			redirectProposeCard: false
		};
	}

	componentWillMount() {}

	componentDidMount() {
		this.getCardSource();
	}

	getCardSource = async () => {
		var url = '/api/publiccards';
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
					backs: vocab.backs.map((back, index2) => back.meaning).join(' - '),
					originBacks: vocab.backs
				};
				mockData.push(oldVocab);
			});
			return mockData;
		}
	};

	onClickDownloadCard = async front => {
		Swal.fire({
			title: 'Are you sure to download this card?',
			showCancelButton: true,
			cancelButtonColor: '#b3b3b3',
			// confirmButtonColor: '#DD3333',
			confirmButtonText: 'Yes!'
		}).then(result => {
			if (result.value) {
				this.downloadCard(front);
			}
		});
	};

	downloadCard = async front => {
		var url = '/api/publiccards/' + front + '/download';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
	};

	downloadAllCards = async () => {
		var url = '/api/publiccards/download';
		const token = await authService.getAccessToken();
		var r = window.confirm('Are you sure to delete this card?');
		if (r == true) {
			const response = await fetch(url, {
				headers: !token ? {} : { Authorization: `Bearer ${token}` }
			});
		}
		// const data = await response.json();
	};

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
			this.getCardSource();
		}
	};

	cardSource = () => {
		if (this.state.cardSource.length !== undefined) {
			var data = this.transData(this.state.cardSource);
			console.log(this.state.cardSource);
		}
		var title = 'Public cards';
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
						icon: () => <Icon className="far fa-hand-paper" style={{ fontSize: 18 }}/>,
						tooltip: 'Propose Card',
						isFreeAction: true,
						onClick: event => this.redirectProposeCard()
					},
					{
						icon: () => <Icon className="far fa-arrow-to-bottom" style={{ fontSize: 18 }}/>,
						tooltip: 'Download All Cards',
						isFreeAction: true,
						onClick: event => this.downloadAllCards()
					},
					{
						icon: 'add',
						tooltip: 'Download card',
						onClick: (event, rowData) => this.onClickDownloadCard(rowData.front)
					}
				]}
				options={{
					pageSize: 10
				}}
			/>
		);
	};

	redirectProposeCard = () => {
		this.setState({
			redirectProposeCard: true
		});
	};

	render() {
		var editCardURL = '/editcard/' + this.state.front;
		var cardSource = this.cardSource();
		if (this.state.redirectProposeCard === true) {
			return <Redirect to={{
        pathname: '/proposecard',
        state: { returnUrl: '/publiccards' } 
      }} />;
		}
		return (
			<div>
				<div className="card-management">
					<div className="deck-cards">{cardSource}</div>
				</div>
			</div>
		);
	}
}

export default PublicCard;
