import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import PropTypes from 'prop-types';
import { Button, Input, Pagination } from 'antd';
import authService from '../../api-authorization/AuthorizeService';

import './DeckForm.css';

const { Search } = Input;

class DeckForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
			name: null,
			description: null,
			theme: '#95DDED',
		};
	}

	createDeck = () => {

		let deck = {
			name: this.state.name,
			description: this.state.description,
			theme: this.state.theme,
		}

		this.props.onCreateDeck(deck);
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.createDeck();
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
		const backgroundColor = {
			background: this.props.backgroundColor,
		};

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
									value="#95DDED"
									defaultChecked
									// checked={this.state.selectedOption === '#95DDED'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button">
									<span style={{ background: '#95DDED' }}></span>
								</div>
							</label>

							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#9FCBF5"
									// checked={this.state.selectedOption === '#9FCBF5'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button">
									<span style={{ background: '#9FCBF5' }}></span>
								</div>
							</label>

							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#FFB1B1"
									// checked={this.state.selectedOption === '#FFB1B1'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button">
									<span style={{ background: '#FFB1B1' }}></span>
								</div>
							</label>

							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#FDD39D"
									// checked={this.state.selectedOption === '#FDD39D'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button">
									<span style={{ background: '#FDD39D' }}></span>
								</div>
							</label>

							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#B7EB8F"
									// checked={this.state.selectedOption === '#B7EB8F'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button">
									<span style={{ background: '#B7EB8F' }}></span>
								</div>
							</label>

							<label class="circle">
								<input
									type="radio"
									name="theme"
									value="#EBAAEA"
									// checked={this.state.selectedOption === '#EBAAEA'}
									// onChange={(e) => this.handleInputChange(e)}
								/>
								<div class="button">
									<span style={{ background: '#EBAAEA' }}></span>
								</div>
							</label>
						</div>
						<div className="deck-form-button">
							<button className="deck-form-button-cancel">Cancel</button>
							<button
								className="deck-form-button-create"
								type="submit"
								value="Submit"
							>
								Create
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeckForm);
