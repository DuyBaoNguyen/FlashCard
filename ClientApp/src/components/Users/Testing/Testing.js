import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { Route } from 'react-router';
// import Dashboard from '../Dashboard/Dashboard';
import Button from '@material-ui/core/Button';
import {
	BrowserRouter as Router,
	Switch,
	Link,
	Redirect,
	withRouter
} from 'react-router-dom';
import classnames from 'classnames';
import './Testing.css';
import Swal from 'sweetalert2';
import Dashboard from '../Dashboard/Dashboard';

// // CommonJS
// const Swal = require('sweetalert2')

var next = undefined;
var array = [];
var rememberCards = [];
var dontRememberCards = [];
class Testing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			nextButton: true,
			deckData: [],
			firstDisplay: false,
			dontremember: [],
			remember: [],
			redirect: false,
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
	}

	unique = array => {
		return Array.from(new Set(array));
	};

	isFinish = (array, totalCards, dontRememberCards) => {
		let uniqueTotal = this.unique(totalCards);
		let uniqueDontRemember = this.unique(dontRememberCards)
		let uniqueRemember = this.unique(uniqueTotal.filter(x => !dontRememberCards.includes(x)));

		var text =
			'Remember: ' +
			uniqueRemember.length +
			' cards -  Dont remember: ' +
			uniqueDontRemember.length +
			' cards';

		this.setState({
			remember: uniqueRemember,
			dontremember: uniqueDontRemember
		});
		if (array.length === 0) {
			Swal.fire({
				title: 'Your result',
				text: text,
				icon: 'success',
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'OK'
			}).then(result => {
				this.sendResult(this.state.remember, this.state.dontremember);
			});
		}
	};

	sendResult = async (r, dr) => {
		let url = '/api/decks/' + this.state.id + '/test';
		console.log(url);
		const token = await authService.getAccessToken();
		// console.log(token);
		let data = {
			failedCardIds: dr,
			successCardIds: r
		};

		console.log(data);

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data),
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
		this.setState({
			redirect : true
		});
	};

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
		// console.log(data);
		this.setState({ deckData: data, loading: false });
	};

	onRemember = next => {
		rememberCards.push(next.id);
		this.setState({
			nextButton: true,
		});
			array.splice(array.indexOf(next), 1);
	};

	onDontRemember = next => {
		dontRememberCards.push(next.id);
		this.setState({
			nextButton: true,
		});
	};

	onNext = () => {
		array = this.state.deckData.cards;
		// array.splice(0, 1);
		console.log(this.state.deckData.cards);
		this.isFinish(array, rememberCards, dontRememberCards);
		next = array[Math.floor(Math.random() * array.length)];

		this.setState({
			nextButton: false,
			firstDisplay: true
		});
		
	};

	render() {
		if (next !== undefined) {
			console.log(next);

			var backSide = next.backs.map(back => {
				return (
					<div className="content-back-side">
						<p className="meaning">{back.meaning}</p>
						<p className="type">{back.type}</p>
						<p className="example">{back.example}</p>
						<p className="image">{back.image}</p>
					</div>
				);
			});
		}

		if (this.state.redirect === true) {
			return <Redirect to='/' Component={Dashboard} />;
		}
		return (
			<div>
				<div className="field">
					<div className="back-button">
						<a href="#">Back</a>
					</div>
					<div
						className={classnames(
							this.state.firstDisplay === false ? 'none-display' : ''
						)}
					>
						<div className="content">
							<div className="content-front">
								{next === undefined ? (
									<p>
										There's no card left
									</p>
								) : (
									<p>{next.front}</p>
								)}
								{/* {array === undefined ? 'loading...' : array[0]._id} */}
							</div>
							<div
								className={classnames(
									'content-back',
									this.state.nextButton === false
										? 'none-display'
										: 'display-grid'
								)}
							>
								{backSide}
							</div>
						</div>
					</div>
					<div className="buttons">
						<div
							className={classnames(
								'test-button',
								this.state.nextButton === true ? 'none-display' : ''
							)}
						>
							<Button
								className="test-button-grey"
								onClick={() => this.onDontRemember(next)}
								type="button"
								color="primary"
							>
								<p>Don't Remember</p>
							</Button>
							<Button
								className="test-button-orange"
								onClick={() => this.onRemember(next)}
								type="button"
								color="primary"
							>
								<p>Remember</p>
							</Button>
						</div>
						<div
							className={classnames(
								'test-button',
								this.state.nextButton === false ? 'none-display' : ''
							)}
						>
							<Button
								className="test-button-next"
								onClick={this.onNext}
								type="button"
							>
								<p>{this.state.firstDisplay === true ? 'Next' : 'Start'}</p>
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default withRouter(Testing);