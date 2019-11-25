import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import './DeckDetail.css';
import Info from '../../modules/Info/Info';
import Testing from '../Testing/Testing';
import MaterialTable from 'material-table';

class DeckDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			deckData: {},
			redirectTesting: false
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

	redirectTesting = () => {
		this.setState({
			redirectTesting: true
		});
	};

	transData = () => {
		var mockData = {};
		var oldVocab = Object.create(null);
		console.log(this.state.deckData.cards);
		// Object.keys(this.state.deckData.cards).map((vocab, index) => {
			// oldVocab = {
			// 	id : vocab.id,
			// 	front : vocab.front,
			// 	backs : vocab.backs.map((back, index2) => {
			// 		return back + ' ';
			// 	})
			// console.log(vocab.id);
			// };
			// mockData.push(oldVocab);
		// });
		// return mockData;

		// data.map((vocab, index) => {
		// 	// oldVocab.id = vocab[index].id;
		// 	// oldVocab.front = vocab[index].front;
		// 	// oldVocab.backs = vocab[index].backs.map((back,index2) => {
		// 	// 	newBackVocab += back[index2];
		// 	// 	return newBackVocab;
		// 	// });
		// 	// mockData.push(oldVocab);
		// 	console.log(vocab.id);
		// });
	};

	table = () => {
		var data = this.state.deckData.cards;
		// Array.isArray(data.map((test, index) =>{
		// 	console.log("hihi");
		// }));
		var newData = this.transData();
		return (
			<MaterialTable
				title="Cards in deck"
				columns={[
					{ title: 'Front', field: 'front' },
					{ title: 'Back', field: 'backs.meaning' }
				]}
				data={this.state.deckData.cards}
				options={{
					search: true,
					minBodyHeight: 100
				}}
			/>
		);
	};

	render() {
		var date = new Date(this.state.deckData.createdDate);
		console.log('/api/decks/' + this.state.id.toString());
		var testURL = '/testing/' + this.state.id.toString();
		if (this.state.redirectTesting === true) {
			return <Redirect to={testURL} Component={Testing} />;
		}
		var table = this.table();
		return (
			<div>
				<div className="deck-fields">
					<div className="deck-back">
						<a href="/">Back</a>
					</div>
					<div className="deck-content">
						<div class="deck-content-info">
							<div class="deck-title">Info</div>
							<div class="deck-content-info-line">
								Deck name: {this.state.deckData.name}
							</div>
							<div class="deck-content-info-line">Number of cards:</div>
							<div class="deck-content-info-line">
								Date created: {date.toLocaleDateString()}
							</div>
						</div>
						<Info data={this.state.deckData.statistics}></Info>
						<div className="deck-content-advanced">
							<div class="deck-content-advanced-features">
								<div class="deck-title">Features</div>
							</div>
							<div class="deck-content-advanced-features-items">
								<a href="#">Manage card </a>
							</div>
							<div class="deck-content-advanced-features-items">
								<a href="#">Delete deck</a>
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
					<div class="deck-button" onClick={this.redirectTesting}>
						<p>Review</p>
					</div>
				</div>
			</div>
		);
	}
}

export default DeckDetail;
