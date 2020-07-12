import React, { Component } from 'react';
import { connect } from 'react-redux';

import withErrorHandler from '../../../hoc/withErrorHandler';
import Pagination from 'react-js-pagination';
import UserDeck from './UserDeck/UserDeck';
import './UserDecks.css';

class UserDecks extends Component {
	state = {
		activePage: 1,
		currentUserId: null
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.currentUserId !== nextProps.currentUserId) {
			return {
				...prevState,
				activePage: 1,
				currentUserId: nextProps.currentUserId
			};
		}
		return null;
	}

	handlePageChange = (pageNumber) => {
		this.setState({ activePage: pageNumber });
	}

	render() {
		const { currentUserDecks, currentUser } = this.props;
		let decksList = <p className="text-notify">There are no decks here!</p>;
		let pagination;

		if (currentUserDecks.length > 0) {
			decksList = currentUserDecks
				.filter((deck, index) => index >= (this.state.activePage - 1) * 4 && index <= this.state.activePage * 4 - 1)
				.map((deck) => <UserDeck key={deck.id} user={currentUser} deck={deck} />);

			pagination = (
				<Pagination
					hideFirstLastPages
					prevPageText="<"
					nextPageText=">"
					activePage={this.state.activePage}
					itemsCountPerPage={4}
					totalItemsCount={currentUserDecks.length}
					pageRangeDisplayed={5}
					onChange={this.handlePageChange}
					activeClass="pagination-item-active"
					itemClass="pagination-item"
				/>
			);
		}

		return (
			<div className="profile-decks-wrapper">
				<div className="profile-decks">{decksList}</div>
				<div className="decks-pagination">{pagination}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		currentUserId: state.usersmanagement.currentUserId,
		currentUser: state.usersmanagement.currentUser,
		currentUserDecks: state.usersmanagement.currentUserDecks,
	};
};

export default connect(mapStateToProps)(withErrorHandler(UserDecks));
