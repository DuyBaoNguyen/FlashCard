import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';

import Search from '../../Shared/Search/Search';
import Button from '../../Shared/Button/Button';
import Loading from '../../Shared/Loading/Loading';
import * as actions from '../../../store/actions';
import Deck from './Deck/Deck';
import { TIME_OUT_DURATION } from '../../../applicationConstants';
import './DeckWrapper.css';

class DeckWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
			setLoading: false
		};
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	componentDidMount() {
		this.props.onGetDecks('');

		if (!this.state.setLoading && !this.timeoutNumber) {
			this.timeoutNumber = setTimeout(() => {
				if (this.props.loading) {
					this.setState({ setLoading: true });
				}
			}, TIME_OUT_DURATION);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeoutNumber);
	}

	handleSearchDeck = (event) => {
		this.props.onGetDecks(event.target.value);
		this.setState({ activePage: 1 });
	};

	render() {
		const { loading } = this.props;
		const { setLoading } = this.state;
		let deckList = loading ? setLoading && <Loading /> : <p className="text-notify">There are no decks here!</p>;
		let pagination;

		if (this.props.decks.length > 0 && !loading) {
			deckList = (
				<div className="decks">
					{this.props.decks
						.filter((deck, index) => index >= (this.state.activePage - 1) * 4 && index <= this.state.activePage * 4 - 1)
						.map((deck, index) => <Deck key={deck.id} deck={deck} />)}
				</div>
			);

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
				{deckList}
				<div className="deck-pagination">{pagination}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		decks: state.home.decks,
		loading: state.home.loadings.getDecksLoading
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetDecks: (name) => dispatch(actions.getDecks(name)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DeckWrapper);
