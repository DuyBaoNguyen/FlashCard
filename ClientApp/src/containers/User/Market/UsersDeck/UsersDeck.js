import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler';
import * as actions from '../../../../store/actions/index';
import Pagination from 'react-js-pagination';
import Deck from './Deck/Deck';
import './UsersDeck.css';

class Decks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	componentDidMount() {
		this.props.onGetUsersPublicDecks();
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	render() {
		let pagination = (
			<Pagination
				hideFirstLastPages
				prevPageText="<"
				nextPageText=">"
				activePage={this.state.activePage}
				itemsCountPerPage={4}
				totalItemsCount={
					this.props.usersPublicDecks !== null
						? this.props.usersPublicDecks.length
						: null
				}
				pageRangeDisplayed={5}
				onChange={this.handlePageChange.bind(this)}
				activeClass="pagination-item-active"
				itemClass="pagination-item"
			/>
		);
		let deckList = (
			<div className="decks">
				{this.props.usersPublicDecks
					.filter(
						(deck, index) =>
							index >= (this.state.activePage - 1) * 4 &&
							index <= this.state.activePage * 4 - 1
					)
					.map((deck, index) => (
						<Deck key={deck.id} deck={deck} />
					))}
			</div>
		);
		return (
			<>
				{' '}
				<div className="market-decks-wrapper">{deckList}</div>
				<div className="deck-pagination">{pagination}</div>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		usersPublicDecks: state.market.usersPublicDecks,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetUsersPublicDecks: () => dispatch(actions.getUsersPublicDecks()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Decks));
