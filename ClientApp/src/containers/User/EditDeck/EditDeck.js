import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import withErrorHandler from '../../../hoc/withErrorHandler';
import DeckForm from '../../../components/User/DeckForm/DeckForm';

import './EditDeck.css';

class EditDeck extends Component {
	componentDidMount() {
		this.deckId = this.props.match.params.deckId;
		this.props.onGetDeck(this.deckId);
	}

	render() {
		const { deck, backUrl } = this.props;
		return (
			<div className="create-deck-wrapper">
				<div className="form">
					<DeckForm
						deck={deck}
						id={this.props.match.params.deckId}
						editDeck={true}
						header="Edit deck"
						backUrl={backUrl}
					/>
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
