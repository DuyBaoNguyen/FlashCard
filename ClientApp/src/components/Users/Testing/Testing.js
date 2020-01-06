import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { Route } from 'react-router';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
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

// // CommonJSt
// const Swal = require('sweetalert2')

class Testing extends Component {
	constructor(props) {
		super(props);
		this.array = [];
		// eslint-disable-next-line no-unused-expressions
		this.vocab;
		this.arrayTotal = [];
		this.arrayDontRemember = [];
		this.state = {
			passCard: 0,
			length: 0,
			process: 0,
			currentVocab: null,
			displayNextButton: true,
			deckData: null,
			firstDisplay: true,
			id: '',
			redirect: false
		};
	}

	componentDidMount() {
		this.instruction();
		this.getDeckData();
	}

	instruction = () => {
		let timerInterval;
		Swal.fire({
			allowOutsideClick: false,
			allowEscapeKey: false,
			allowEnterKey: false,
			heightAuto: false,
			title: 'Hold on!',
			html: 'We are processing the test!',
			timer: 2000,
			// timerProgressBar: true,
			onBeforeOpen: () => {
				Swal.showLoading();
			},
			onClose: () => {
				clearInterval(timerInterval);
			}
		}).then(result => {});
	};

	getDeckData = async () => {
		let url = '/api/decks/' + this.props.match.params.deckId;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({
			deckData: data.cards,
			length: data.cards.length,
			loading: false
		});
		localStorage.setItem('deckData', JSON.stringify(this.state.deckData));

		// Retrieve the object from storage
		let deckData = localStorage.getItem('deckData');
		this.array = this.state.deckData;
	};

	process = () => {
		this.setState({
			process: (((this.state.passCard + 1) / this.state.length) * 100).toFixed(
				2
			)
		});
	};

	isFinish = (array, arrayTotal, arrayDontRemember) => {
		let uniqueArrayTotal = this.unique(arrayTotal);
		let uniqueArrayDontRemember = this.unique(arrayDontRemember);
		let uniqueArrayRemember = this.unique(
			uniqueArrayTotal.filter(x => !uniqueArrayDontRemember.includes(x))
		);

		var text =
			'Remember: ' +
			uniqueArrayRemember.length +
			' cards -  Dont remember: ' +
			uniqueArrayDontRemember.length +
			' cards';

		if (array.length === 0) {
			Swal.fire({
				allowOutsideClick: false,
				title: 'Your result',
				backdrop: true,
				text: text,
				icon: 'success',
				confirmButtonColor: '#007bff',
				confirmButtonText: 'OK'
			}).then(result => {
				this.sendResult(uniqueArrayRemember, uniqueArrayDontRemember);
			});
		}
	};

	onRemember = vocab => {
		this.setState({
			passCard: this.state.passCard + 1,
			displayNextButton: true
		});
		if (vocab != null) {
			this.array.splice(this.array.indexOf(vocab), 1);
		}
		this.process();
		this.arrayTotal.push(vocab.id);
	};

	onDontRemember = vocab => {
		this.setState({
			// passCard: this.state.passCard + 1,
			displayNextButton: true
		});
		// this.process();
		this.arrayDontRemember.push(vocab.id);
	};

	onNext = () => {
		this.vocab = this.array[Math.floor(Math.random() * this.array.length)];
		this.setState({
			displayNextButton: false,
			firstDisplay: false
		});
		if (this.vocab === undefined) {
			this.isFinish(this.array, this.arrayTotal, this.arrayDontRemember);
		}

		console.log(this.arrayTotal, this.arrayDontRemember);
	};

	sendResult = async (r, dr) => {
		let url = '/api/decks/' + this.props.match.params.deckId + '/test';
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
			redirect: true
		});
	};

	unique = array => {
		return Array.from(new Set(array));
	};

	render() {
		if (this.state.redirect === true) {
			return <Redirect to="/" Component={Dashboard} />;
		}
		if (this.vocab !== undefined) {
			console.log(this.vocab);

			var backSide = this.vocab.backs.map(back => {
				let image = new Image();
				image.src = back.image;
				// console.log(back.image);
				return (
					<div className="content-back-side">
						<div className="info">
							<p className="meaning">{back.meaning}</p>
							<p className="type">{back.type}</p>
							<p className="example">{back.example}</p>
						</div>
						<img
							src={back.image}
							className={classnames(
								'image',
								back.image === null ? 'none-display' : ''
							)}
						/>
					</div>
				);
			});
		}

		// if (this.state.redirect === true) {
		// 	return <Redirect to='/' Component={Dashboard} />;
		// }
		let deckData = localStorage.getItem('deckData');

		console.log('retrievedObject: ', JSON.parse(deckData));
		return (
			<div className="field">
				<div className="back-button">
					<Link to={'/decks/' + this.props.match.params.deckId}>Back</Link>
				</div>
				<Progress
					className="process-bar"
					percent={this.state.process}
					// status="success"
				/>
				<div
					className={classnames(
						this.state.firstDisplay === true ? 'none-display' : ''
					)}
				>
					<div className="content">
						<div className="content-front">
							<p>
								{this.vocab !== undefined ? this.vocab.front : 'No card left'}
							</p>
						</div>
						<div
							className={classnames(
								'content-back',
								this.state.displayNextButton === false
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
							this.state.displayNextButton === true ? 'none-display' : ''
						)}
					>
						<Button
							className="test-button-grey"
							onClick={() => this.onDontRemember(this.vocab)}
							type="button"
							color="primary"
						>
							<p>Don't Remember</p>
						</Button>
						<Button
							className="test-button-orange"
							onClick={() => this.onRemember(this.vocab)}
							type="button"
							color="primary"
						>
							<p>Remember</p>
						</Button>
					</div>
					<div
						className={classnames(
							'test-button',
							this.state.displayNextButton === false ? 'none-display' : ''
						)}
					>
						<Button
							className="test-button-next"
							onClick={this.onNext}
							type="button"
						>
							<p>{this.state.firstDisplay === true ? 'Start' : 'Next'}</p>
						</Button>
					</div>
				</div>
			</div>
		);
	}
}
export default withRouter(Testing);
