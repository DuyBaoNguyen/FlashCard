import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import {
	BrowserRouter as Router,
	Redirect,
} from 'react-router-dom';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Navbar from '../../modules/NavBar/Navbar';
import './DeckDetail.css';
import Info from '../../modules/Info/Info';
import Testing from '../Testing/Testing';

class DeckDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			deckData: [],
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
		var url = '/api/decks/7';
		const token = await authService.getAccessToken();
    const response = await fetch(url, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
		const data = await response.json();
    this.setState({ deckData: data, loading: false });
	}

	redirectTesting = () => {
		this.setState({
			redirectTesting: true
		});
	};

	render() {
		var date = new Date(this.state.deckData.createdDate);
		// console.log('/api/decks/' + this.state.id.toString());
		var testURL = '/testing/' + this.state.id.toString();
		if (this.state.redirectTesting === true) {
			return <Redirect to={testURL} Component={Testing} />;
		}
		return (
			<div>
				<Navbar navTitle="Deck Detail" />
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
							<div class="deck-content-advanced-share">
								<div class="deck-title">Share deck</div>
								<div class="switch">
									<FormGroup row>
										<FormControlLabel
											control={<Switch value="checkedA" color="primary" />}
											label="Secondary"
										/>
									</FormGroup>
								</div>
							</div>
						</div>
					</div>
					<div class="deck-button" onClick={this.redirectTesting}>
						<p>Review</p>
					</div>
				</div>
			</div>
		);
	}
}

export default DeckDetail;