import React, { Component } from 'react';
import { connect } from 'react-redux';

import DeckForm from '../../../components/User/DeckForm/DeckForm';
import * as actions from '../../../store/actions';
import withErrorHandler from '../../../hoc/withErrorHandler';
import './EditDeck.css';

class EditDeck extends Component {
	componentDidMount() {
		this.deckId = this.props.match.params.deckId;
		this.props.onGetDeck(this.deckId);
	}

	render() {
		const { deck } = this.props;
		return (
			<div className="create-deck-wrapper">
				<div className="form">
					<DeckForm deck={deck} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		deck: state.deckDetail.deck,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetDeck: (id) => dispatch(actions.getDeck(id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(EditDeck));
