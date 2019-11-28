import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { Route } from 'react-router';
import Button from '@material-ui/core/Button';
import {
	BrowserRouter as Router,
	Switch,
	Link,
	Redirect,
	withRouter
} from 'react-router-dom';
import Navbar from '../../modules/NavBar/Navbar';
import classnames from 'classnames';
import './Testing.css';

var next = undefined;
var array = [];
class Testing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			nextButton: true,
			removeCard: false,
			deckData: [],
			firstDisplay: false,
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

	isFinish = () => {
		if (array === null) {
			alert('Done');
			// return <Redirect to="/" Component={Dashboard} />;
		}
	};

	getDeckIDFromPath = url => {
		return url.substr(9);
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

	onRemember = () => {
		this.setState({
			nextButton: true,
			removeCard: true
		});
	};

	onDontRemember = () => {
		this.setState({
			nextButton: true
		});
	};

	onNext = () => {
		array = this.state.deckData.cards;
		next = array[Math.floor(Math.random() * array.length)];
		// console.log(next.backs);
		if (this.state.removeCard === true) {
			array.splice(array.indexOf(next), 1);
		}
		this.isFinish();
		this.setState({
			nextButton: false,
			removeCard: false,
			firstDisplay: true
		});
		// console.log(array);
	};

	render() {
		var data = this.state.deckData.cards;
		// console.log(data);
		// console.log(this.state.firstDisplay);
		// var backSize = next.backs
		if (next != undefined) {
			var backSide = next.backs.map(back => {
				return(
					<div className="content-back-side">
						<p>{back.meaning}</p>
					</div>	
				);
			})
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
										There's no card left but still dont know how to deal with it
									</p>
								) : (
									<p>{next.front}</p>
								)}
								{/* {array === undefined ? 'loading...' : array[0]._id} */}
							</div>
							<div
								className={classnames(
									'content-back',
									this.state.nextButton === false ? 'none-display' : ''
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
								onClick={this.onDontRemember}
								type="button"
								color="primary"
							>
								<p>Don't Remember</p>
							</Button>
							<Button
								className="test-button-orange"
								onClick={this.onRemember}
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
