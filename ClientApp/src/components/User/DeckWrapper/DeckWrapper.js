import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';

import Search from '../../Shared/Search/Search';
import Button from '../../Shared/Button/Button';
import * as actions from '../../../store/actions';
import Deck from './Deck/Deck';

import './DeckWrapper.css';

class DeckWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	componentDidMount() {
		this.props.onGetDecks('');
	}

	handleSearchDeck = (event) => {
		this.props.onGetDecks(event.target.value);
		this.setState({ activePage: 1 });
	};

	render() {
		let deckList = <p className="text-notify">There are no decks here!</p>;
		let pagination;

		if (this.props.decks !== null && this.props.decks.length > 0) {
			deckList = this.props.decks
				.filter((deck, index) => index >= (this.state.activePage - 1) * 4 && index <= this.state.activePage * 4 - 1)
				.map((deck, index) => <Deck key={deck.id} deck={deck} />);

			pagination = (
				<Pagination
					hideFirstLastPages
					prevPageText="<"
					nextPageText=">"
					activePage={this.state.activePage}
					itemsCountPerPage={4}
					totalItemsCount={
						this.props.decks !== null ? this.props.decks.length : null
					}
					pageRangeDisplayed={5}
					onChange={this.handlePageChange.bind(this)}
					activeClass="pagination-item-active"
					itemClass="pagination-item"
				/>
			);
		}

		return (
			<div className="deck-wrapper">
				<div className="deck-header">
					<p>My decks</p>
					<div className="deck-header-features">
						<Button
							className="deck-header-features-add"
							type="link"
							path="/createdeck"
							icon={<Icon icon={plusIcon} />}>
						</Button>
						<Search
							placeholder="Search..."
							onChange={(event) => this.handleSearchDeck(event)}
						/>
					</div>
				</div>
				<br />
				<div className="decks">{deckList}</div>
				<div className="deck-pagination">{pagination}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		decks: state.home.decks,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetDecks: (name) => dispatch(actions.getDecks(name)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DeckWrapper);
