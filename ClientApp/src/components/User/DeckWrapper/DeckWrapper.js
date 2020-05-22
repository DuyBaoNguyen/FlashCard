import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { Button, Input } from 'antd';
import { Icon, InlineIcon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';
import * as actions from '../../../store/actions/index';
import Deck from '../Deck/Deck';
import './DeckWrapper.css';

const { Search } = Input;

class DeckWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
			hasError: false,
		};
	}

	handlePageChange(pageNumber) {
		console.log(pageNumber);
		this.setState({ activePage: pageNumber });
	}

	componentDidMount() {
		this.props.onGetDecks();
	}

	render() {
		let deckList;
		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}

		if (this.props.decks === null) {
			console.log('null');
		} else {
			deckList = this.props.decks.map((deck, index) => {
				return (
					<>
						{index >= (this.state.activePage - 1) * 4 &&
						index <= this.state.activePage * 4 - 1 ? (
							<Deck
								backgroundColor="#95dded"
								name={deck.name}
								description={deck.description}
								cards={deck.totalCards}
								date={deck.createdDate}
							/>
						) : undefined}
					</>
				);
				// return <Deck backgroundColor="#95dded" name={deck.name} description={deck.description} cards={deck.totalCards} date={deck.createdDeck} />;
			});
		}
		return (
			<div className="deck-wrapper">
				<div className="deck-header">
					<p>My decks</p>
					<div className="deck-header-features">
						<Button
							className="deck-header-features-add"
							type="primary"
							shape="rounded"
							icon={<Icon icon={plusIcon} />}
							size="medium"
						/>
						<Search
							className="deck-header-features-search"
							placeholder="Search..."
						/>
					</div>
				</div>
				<br />
				<div className="decks">{deckList}</div>
				<div className="deck-pagination">
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
				</div>
				{/* <div className="decks">
					{deckList} */}
				{/* <Deck backgroundColor="#95dded" cards="123" date="12th May, 2020" />
					<Deck backgroundColor="#9FCBF5" cards="123" date="12th May, 2020" />
					<Deck backgroundColor="#FFB1B1" cards="123" date="12th May, 2020" />
					<Deck backgroundColor="#FDD39D" cards="123" date="12th May, 2020" /> */}
				{/* <Deck backgroundColor='#9FCBF5'/> */}
				{/* </div> */}
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
		onGetDecks: () => dispatch(actions.getDecks()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DeckWrapper);
