import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';

import UserPublicDeck from '../../../../components/User/UserPublicDeck/UserPublicDeck';
import Loading from '../../../../components/Shared/Loading/Loading';
import Search from '../../../../components/Shared/Search/Search';
import { TIME_OUT_DURATION } from '../../../../applicationConstants';
import * as actions from '../../../../store/actions/index';
import './UserDecks.css';

const AMOUNT_DECKS = 6;

class UserDecks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
			setLoading: false
		};
	}

	componentDidMount() {
		this.props.onGetUserPublicDecks();

		if (!this.state.setLoading) {
			setTimeout(() => {
				if (this.props.loading) {
					this.setState({ setLoading: true });
				}
			}, TIME_OUT_DURATION);
		}
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	handleSearchDecks = (event) => {
		const searchString = event.target.value;
		this.props.onUpdateSearchString(searchString);
		this.props.onGetUserPublicDecks(searchString);
		this.setState({ activePage: 1 });
	}

	render() {
		const { decks, loading, searchString } = this.props;
		let { activePage, setLoading } = this.state;
		let decksList = loading ? setLoading && <Loading /> : <p className="text-notify">There are no decks here!</p>;
		let pagination;

		if (decks?.length > 0 && !loading) {
			decksList = (
				<div className="decks">
					{decks
						.filter((deck, index) => index >= (activePage - 1) * AMOUNT_DECKS && index <= activePage * AMOUNT_DECKS - 1)
						.map(deck => (
							<UserPublicDeck key={deck.id} deck={deck} />
						))}
				</div>
			);

			pagination = (
				<Pagination
					hideFirstLastPages
					prevPageText="<"
					nextPageText=">"
					activePage={activePage}
					itemsCountPerPage={AMOUNT_DECKS}
					totalItemsCount={decks?.length}
					pageRangeDisplayed={5}
					onChange={this.handlePageChange.bind(this)}
					activeClass="pagination-item-active"
					itemClass="pagination-item"
				/>
			);
		}

		return (
			<div className="market-decks-wrapper">
				<div className="market-decks-header">
					<div className="market-decks-header-features">
						<Search
							className="market-decks-search-box"
							placeholder="Search..."
							value={searchString}
							onChange={this.handleSearchDecks} />
					</div>
				</div>
				{decksList}
				<div className="deck-pagination">{pagination}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		decks: state.market.userPublicDecks,
		searchString: state.market.userPublicDecksSearchString,
		loading: state.market.loadings.getUserPublicDecksLoading
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetUserPublicDecks: (name) => dispatch(actions.getUserPublicDecks(name)),
		onUpdateSearchString: (value) => dispatch(actions.updateUserPublicDecksSearchString(value))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDecks);
