import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import withErrorHandler from '../../../hoc/withErrorHandler';
import DeckForm from '../../../components/User/DeckForm/DeckForm';

import './EditDeck.css';

class EditDeck extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
		};
	}

	render() {
		const { deck} = this.props;
		console.log(deck);
		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}
		return (
			<div className="create-deck-wrapper">
				<div className="form">
					<DeckForm
						id={this.props.match.params.deckId}
						editDeck={true}
						header="Edit deck"
					/>
				</div>
			</div>
		);
	}
}
export default EditDeck;
