import React, { Component } from 'react';

import DeckForm from '../../../components/User/DeckForm/DeckForm';

import './EditDeck.css';

class EditDeck extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
			id: 10,
		};
	}

	render() {
		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}
		return (
			<div className="create-deck-wrapper">
				<div className="form">
					<DeckForm id={this.state.id} editDeck={true} header="Edit deck" />
				</div>
			</div>
		);
	}
}

export default EditDeck;
