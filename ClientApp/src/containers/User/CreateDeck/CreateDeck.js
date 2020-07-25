import React, { Component } from 'react';

import DeckForm from '../../../components/User/DeckForm/DeckForm';
import './CreateDeck.css';

class CreateDeck extends Component {
	render() {
		return (
			<div className="create-deck-wrapper">
				<div className='form'>
					<DeckForm />
				</div>
			</div>
		);
	}
}

export default CreateDeck;
