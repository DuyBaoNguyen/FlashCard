import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../hoc/withErrorHandler';
import * as actions from '../../../../../store/actions/index';
import Deck from '../../../../../components/User/DeckWrapper/Deck/Deck';
import './Decks.css';

class Decks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	render() {
		let decks = this.props.currentUserDecks.map((deck, index) => {
			return <Deck key={deck.id} className="profile-deck" deck={deck} />;
		});
		return <div className="profile-decks-wrapper">{decks}</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		currentUserId: state.usersmanagement.currentUserId,
		currentUserDecks: state.usersmanagement.currentUserDecks,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Decks));
