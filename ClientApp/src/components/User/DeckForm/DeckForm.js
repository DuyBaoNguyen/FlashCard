import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import withErrorHandler from '../../../hoc/withErrorHandler';
import { Link, withRouter } from 'react-router-dom';

import './DeckForm.css';

class DeckForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: null,
			description: null,
			theme: '#95dded'
		};
		this.themes = ['#95dded', '#9eacf4', '#ffb1b1', '#fdd39d', '#b7eb8f', '#ebaaea'];
	}

	static getDerivedStateFromProps(props, state) {
		if (props.deck && state.name === null) {
			return {
				name: props.deck.name,
				description: props.deck.description,
				theme: props.deck.theme
			}
		}
		return null;
	}

	editDeck = () => {
		let { id } = this.props;
		let deck = {
			name: this.state.name,
			description: this.state.description,
			theme: this.state.theme,
		};

		const backUrl = this.props.location.backUrl || '/';
		this.props.onEditDeck(deck, id, backUrl);
	};

	createDeck = () => {
		let deck = {
			name: this.state.name,
			description: this.state.description,
			theme: this.state.theme,
		};

		this.props.onCreateDeck(deck);
	};

	handleSubmit = (event) => {
		event.preventDefault();
		if (this.props.editDeck === true) {
			this.editDeck();
		} else {
			this.createDeck();
		}
	};

	handleInputChange = (event) => {
		let target = event.target;
		let name = target.name;
		let value = target.value;
		this.setState({
			[name]: value,
		});
	};

	render() {
		const radios = this.themes.map((theme, index) => (
			<label key={index} className="circle">
				<input
					type="radio"
					name="theme"
					value={theme}
					checked={this.state.theme === theme}
					onChange={(e) => this.handleInputChange(e)} />
				<div className="button-circle">
					<span style={{ background: theme }}></span>
				</div>
			</label>
		));

		return (
			<div className="deck-form">
				<div className="deck-form-wrapper">
					<div className="deck-form-header">
						<p>{this.props.header}</p>
					</div>
					<form onSubmit={this.handleSubmit}>
						<div className="deck-form-input">
							<label>Deck name</label>
							<input
								type="text"
								name="name"
								checked
								defaultValue={this.state.name}
								autoComplete="off"
								onChange={(e) => this.handleInputChange(e)}
							/>
						</div>
						<div className="deck-form-input">
							<label>Description</label>
							<input
								type="text"
								name="description"
								defaultValue={this.state.description}
								autoComplete="off"
								onChange={(e) => this.handleInputChange(e)}
							/>
						</div>
						<div className="deck-form-circle">
							{radios}
						</div>
						<div className="deck-form-button">
							<Link to={this.props.location.backUrl || '/'}>
								<button className="deck-form-button-cancel">Cancel</button>
							</Link>
							<button
								className="deck-form-button-create"
								type="submit"
								value="Submit"
							>
								{this.props.editDeck === true ? 'Edit' : 'Create'}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onCreateDeck: (deck) => dispatch(actions.createDeck(deck)),
		onEditDeck: (deck, id, backUrl) => dispatch(actions.editDeck(deck, id, backUrl)),
	};
};

export default withRouter(connect(
	null,
	mapDispatchToProps
)(withErrorHandler(DeckForm)));
