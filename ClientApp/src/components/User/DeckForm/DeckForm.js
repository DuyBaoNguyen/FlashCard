import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Input, Pagination } from 'antd';

import './DeckForm.css';

const { Search } = Input;

class DeckForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
		};
	}

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
					<form>
						<div className="deck-form-input">
							<label for="name">Deck name</label>
							<input type="text" />
						</div>
						<div className="deck-form-input">
							<label for="name">Description</label>
							<input type="text" />
						</div>
						<div className="deck-form-circle">
							<label class="circle">
								<input type="radio" name="color" value="95DDED" />
								<div class="button">
									<span style={{ background: '#95DDED' }}></span>
								</div>
							</label>

							<label class="circle">
								<input type="radio" name="color" value="9FCBF5" />
								<div class="button">
									<span style={{ background: '#9FCBF5' }}></span>
								</div>
							</label>

							<label class="circle">
								<input type="radio" name="color" value="FFB1B1" />
								<div class="button">
									<span style={{ background: '#FFB1B1' }}></span>
								</div>
							</label>

							<label class="circle">
								<input type="radio" name="color" value="FDD39D" />
								<div class="button">
									<span style={{ background: '#FDD39D' }}></span>
								</div>
							</label>

							<label class="circle">
								<input type="radio" name="color" value="B7EB8F" />
								<div class="button">
									<span style={{ background: '#B7EB8F' }}></span>
								</div>
							</label>

							<label class="circle">
								<input type="radio" name="color" value="EBAAEA" />
								<div class="button">
									<span style={{ background: '#EBAAEA' }}></span>
								</div>
							</label>
						</div>
						<div className="deck-form-button">
							<button className="deck-form-button-cancel">Cancel</button>
							<button className="deck-form-button-create">Create</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default DeckForm;
