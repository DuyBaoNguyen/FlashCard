import React, { Component } from 'react';

import DeckForm from '../../../components/User/DeckForm/DeckForm';

import './CreateDeck.css';

class CreateDeck extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
		};
	}

	render() {
		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}
		return (
			<div className="create-deck-wrapper">
				<div className='form'>
        <DeckForm header='Create new deck'/>
        </div>
			</div>
		);
	}
}

export default CreateDeck;
