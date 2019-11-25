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

class Testing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nextButton: false,
			rememberButton: true,
			deckData : [],
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
			rememberButton: false
		});
	};

	onDontRemember = () => {
		this.setState({
			nextButton: true,
			rememberButton: false
		});
	};

	onNext = () => {
		this.setState({
			nextButton: false,
			rememberButton: true
		});
	};

	render() {
		var data = this.state.deckData.cards;
		console.log(data);
		var elm = data.map((card, index) => {
		return <div>{card.id}</div>
		})
		return (
			<div>
				{/* {elm} */}
				<div className="field">
					<div className="back-button">
						<a href="#">Back</a>
					</div>

					<div className="content">
						<div className="content-front">
							<p>This is the front side</p>
						</div>
						<div
							className={classnames(
								'content-back',
								this.state.rememberButton === true ? 'display-button' : ''
							)}
						>
							<div className="content-back-side">
								<p>This is the back side</p>
							</div>
							<div className="content-back-side">
								<p>This is the back side</p>
							</div>
						</div>
					</div>
					<div className="buttons">
						<div
							className={classnames(
								'test-button',
								this.state.nextButton === true ? 'display-button' : ''
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
								onClick={this.onDontRemember}
								type="button"
								color="primary"
							>
								<p>Remember</p>
							</Button>
						</div>
						<div
							className={classnames(
								'test-button',
								this.state.rememberButton === true ? 'display-button' : ''
							)}
						>
							<Button
								className="test-button-next"
								onClick={this.onNext}
								type="button"
								color="primary"
							>
								<p>Next</p>
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Testing);
