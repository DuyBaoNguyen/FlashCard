import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { Link } from 'react-router-dom';
import withErrorHandler from '../../../hoc/withErrorHandler';

import './DeckForm.css';

class DeckForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
			name: this.props.name !== null ? this.props.name : null,
			description:
				this.props.description !== null ? this.props.description : null,
			theme: this.props.theme !== null ? this.props.theme : '#95dded',
		};
	}

	editDeck = () => {
		let id = 37;
		let deck = {
			name: this.state.name,
			description: this.state.description,
			theme: this.state.theme,
		};

		this.props.onEditDeck(deck, id);
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
			// Edit deck calls API here
			this.editDeck();
			console.log('Edit');
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
		// const backgroundColor = {
		// 	background: this.props.backgroundColor,
		// };

		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}
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
								value={this.state.name}
								onChange={(e) => this.handleInputChange(e)}
							/>
						</div>
						<div className="deck-form-input">
							<label>Description</label>
							<input
								type="text"
								name="description"
								value={this.state.description}
								onChange={(e) => this.handleInputChange(e)}
							/>
						</div>
						<div
							className="deck-form-circle"
							onChange={(e) => this.handleInputChange(e)}
						>
							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#95dded"
									defaultChecked
									// checked={this.state.selectedOption === '#95DDED'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button-circle">
									<span style={{ background: '#95dded' }}></span>
								</div>
							</label>

							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#9fcbf5"
									// checked={this.state.selectedOption === '#9FCBF5'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button-circle">
									<span style={{ background: '#9fcbf5' }}></span>
								</div>
							</label>

							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#ffb1b1"
									// checked={this.state.selectedOption === '#FFB1B1'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button-circle">
									<span style={{ background: '#ffb1b1' }}></span>
								</div>
							</label>

							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#fdd39d"
									// checked={this.state.selectedOption === '#FDD39D'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button-circle">
									<span style={{ background: '#fdd39d' }}></span>
								</div>
							</label>

							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#b7eb8f"
									// checked={this.state.selectedOption === '#B7EB8F'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button-circle">
									<span style={{ background: '#b7eb8f' }}></span>
								</div>
							</label>

							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#ebaaea"
									// checked={this.state.selectedOption === '#EBAAEA'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button-circle">
									<span style={{ background: '#ebaaea' }}></span>
								</div>
							</label>
						</div>
						<div className="deck-form-button">
							<Link to={'/'}>
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

const mapStateToProps = (state) => {
	return {
		deck: state.home.deck,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onCreateDeck: (deck) => dispatch(actions.createDeck(deck)),
		onEditDeck: (deck, id) => dispatch(actions.editDeck(deck, id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(DeckForm));
