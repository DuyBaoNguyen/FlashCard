import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';

import Search from '../../Shared/Search/Search';
import Button from '../../Shared/Button/Button';
import Filter from '../../Shared/Filter/Filter';
import Loading from '../../Shared/Loading/Loading';
import * as actions from '../../../store/actions';
import Deck from './Deck/Deck';
import { TIME_OUT_DURATION, Roles } from '../../../applicationConstants';
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

		if (!this.state.setLoading) {
			setTimeout(() => {
				if (this.props.loading) {
					this.setState({ setLoading: true });
				}
			}, TIME_OUT_DURATION);
		}
	}

	handleSearchDeck = (event) => {
		const value = event.target.value;
		this.props.onUpdateDecksSearchString(value);
		this.props.onGetDecks(value);
		this.setState({ activePage: 1 });
	};

	handleFilteredValueChange = (event) => {
		this.props.onSetDecksFilteredValue(event.target.value);
		this.props.onFilterDecks(event.target.value);
		this.setState({ activePage: 1 });
	}

	handleChangeTab = () => {
    this.props.onChangeHomeTab(2);
  }

	render() {
		const { loading, profile, filteredValue, searchString } = this.props;
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
					<div className="decks-header-labels">
						<span className="decks-header-active-label">My decks</span>
						<span
							className="decks-header-label"
							onClick={this.handleChangeTab}>
							My shortcuts
            </span>
					</div>
					<div className="deck-header-features">
						<Button
							className="deck-header-features-add"
							type="link"
							path="/createdeck"
							icon={<Icon icon={plusIcon} />}>
						</Button>
						{profile?.role === Roles.User && (
							<Filter
								className="deck-header-features-filter"
								value={filteredValue}
								onChange={this.handleFilteredValueChange}>
								<option value="all">All</option>
								<option value="completed">Completed</option>
								<option value="not completed">Not completed</option>
							</Filter>
						)}
						<Search
							placeholder="Search..."
							value={searchString}
							onChange={this.handleSearchDeck}
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
		profile: state.home.profile,
		decks: state.home.decks,
		loading: state.home.loadings.getDecksLoading,
		filteredValue: state.home.filteredValues.decksFilteredValue,
		searchString: state.home.decksSearchString
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetDecks: (name) => dispatch(actions.getDecks(name)),
		onFilterDecks: (filteredValue) => dispatch(actions.filterDecks(filteredValue)),
		onSetDecksFilteredValue: (filteredValue) => dispatch(actions.setDecksFilteredValue(filteredValue)),
		onUpdateDecksSearchString: (value) => dispatch(actions.updateDecksSearchString(value)),
		onChangeHomeTab: (tab) => dispatch(actions.changeHomeTab(tab))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DeckWrapper);
