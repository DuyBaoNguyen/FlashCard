import React, { Component } from 'react';
import { connect } from 'react-redux';

import withErrorHandler from '../../../../hoc/withErrorHandler';
import * as actions from '../../../../store/actions/index';

import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import Pagination from 'react-js-pagination';

import Search from '../../../../components/Shared/Search/Search';
import Button from '../../../../components/Shared/Button/Button';
import Filter from '../../../../components/Shared/Filter/Filter';
import Card from '../../../../components/User/Card/Card';
import Loading from '../../../../components/Shared/Loading/Loading';
import { TIME_OUT_DURATION } from '../../../../applicationConstants';
import './Cards.css';

const AMOUNT_CARDS = 12;

class Cards extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activePage: 1,
			setLoading: false,
		};
	}

	componentDidMount() {
		this.props.onGetPublicCards('');

		if (!this.state.setLoading && !this.timeoutNumber) {
			setTimeout(() => {
				if (this.props.loading) {
					this.setState({ setLoading: true });
				}
			}, TIME_OUT_DURATION);
		}
	}

	handleClickCard = (cardId) => {
		this.props.onSelectCard(cardId);
	};

	handlePageChange = (pageNumber) => {
		this.setState({ activePage: pageNumber });
	};

	handleSearchCards = (event) => {
		const searchString = event.target.value;
		this.props.onUpdateSearchString(searchString);
		this.props.onGetCards(searchString);
		this.setState({ activePage: 1 });
	};

	handleDeleteCard = (cardId) => {
		this.props.onDeleteCard(cardId);
	};

	render() {
		const { cards, loading } = this.props;
		let { activePage, setLoading } = this.state;
		let cardsList = loading ? (
			setLoading && <Loading />
		) : (
			<p className="text-notify">There are no cards here!</p>
		);
		let pagination;

		if (cards?.length > 0 && !loading) {
			cardsList = (
				<div className="cards">
					{cards
						.filter(
							(card, index) =>
								index >= (activePage - 1) * AMOUNT_CARDS &&
								index <= activePage * AMOUNT_CARDS - 1
						)
						.map((card) => {
							return (
								<div className=''>
									<Card
									key={card.id}
									displayStatus
									card={card}
									onClick={this.handleClickCard}
								/>
								<Button className='cards-button-download' onClick={() => this.props.onDownloadPublicCard(card.id)}>Download</Button>
								</div>
							);
						})}
				</div>
			);

			pagination = (
				<Pagination
					hideFirstLastPages
					prevPageText="<"
					nextPageText=">"
					activePage={activePage}
					itemsCountPerPage={AMOUNT_CARDS}
					totalItemsCount={cards.length}
					pageRangeDisplayed={5}
					onChange={this.handlePageChange}
					activeClass="pagination-item-active"
					itemClass="pagination-item"
				/>
			);
		}
		return (
			<div className="market-cards-list-wrapper">
				<div className="market-cards-list-header">
					<div className="market-cards-list-header-features">
						<Search placeholder="Search..." onChange={this.handleSearchCards} />
					</div>
				</div>
				{cardsList}
				<div className="cards-pagination">{pagination}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		cards: state.market.cardList,
		// loading: state.cards.loadings.getCardsLoading,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetPublicCards: (front) => dispatch(actions.getPublicCards(front)),
		onSelectCard: (id) => dispatch(actions.selectPublicCard(id)),
		onUpdateSearchString: (value) =>
			dispatch(actions.updateCardsSearchString(value)),
			onDownloadPublicCard: (id) => dispatch(actions.downloadPublicCard(id))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Cards));
