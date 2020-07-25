import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { Icon } from '@iconify/react';
import downloadIcon from '@iconify/icons-uil/arrow-to-bottom';

import withErrorHandler from '../../../../hoc/withErrorHandler';
import * as actions from '../../../../store/actions/index';
import Search from '../../../../components/Shared/Search/Search';
import Button from '../../../../components/Shared/Button/Button';
import Card from '../../../../components/User/Card/Card';
import Loading from '../../../../components/Shared/Loading/Loading';
import CardProposingForm from '../../../../components/User/CardProposingForm/CardProposingForm';
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
		this.props.onGetPublicCards();

		if (!this.state.setLoading) {
			setTimeout(() => {
				if (this.props.loading) {
					this.setState({ setLoading: true });
				}
			}, TIME_OUT_DURATION);
		}
	}

	handlePageChange = (pageNumber) => {
		this.setState({ activePage: pageNumber });
	};

	handleSearchCards = (event) => {
		const searchString = event.target.value;
		this.props.onUpdateSearchString(searchString);
		this.props.onGetPublicCards(searchString);
		this.setState({ activePage: 1 });
	};

	handleDeleteCard = (cardId) => {
		this.props.onDeleteCard(cardId);
	};

	handleOpenCardProposingForm = () => {
		this.props.onToggleCardProposingForm(true);
		this.props.onClearProposeCardError();
	}

	handleCloseCardProposingForm = () => {
		this.props.onToggleCardProposingForm(false);
		this.props.onClearProposeCardError();
	}

	render() {
		const { cards, loading, searchString, cardProposingFormOpen } = this.props;
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
								<div key={card.id}>
									<Card
										key={card.id}
										displayStatus
										card={card}
										onClick={this.handleClickCard}
									/>
									<Button
										className='cards-button-download'
										icon={<Icon icon={downloadIcon} style={{ fontSize: 17 }} />}
										onClick={() => this.props.onDownloadPublicCard(card.id)}>
										Download
									</Button>
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
						<Button
							className="market-cards-propose-btn"
							type="button"
							onClick={this.handleOpenCardProposingForm}>
							Propose
						</Button>
						<Search
							className="market-cards-search-box"
							placeholder="Search..."
							value={searchString}
							onChange={this.handleSearchCards} />
					</div>
				</div>
				{cardsList}
				<div className="cards-pagination">{pagination}</div>
				<CardProposingForm
					isOpen={cardProposingFormOpen}
					onClose={this.handleCloseCardProposingForm} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		cards: state.market.cardList,
		loading: state.market.loadings.getPublicCardsLoading,
		searchString: state.market.publicCardsSearchString,
		cardProposingFormOpen: state.cardProposal.cardProposingFormOpen
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetPublicCards: (front) => dispatch(actions.getPublicCards(front)),
		onSelectCard: (id) => dispatch(actions.selectPublicCard(id)),
		onUpdateSearchString: (value) => dispatch(actions.updatePublicCardsSearchString(value)),
		onDownloadPublicCard: (id) => dispatch(actions.downloadPublicCard(id)),
		onToggleCardProposingForm: (value) => dispatch(actions.toggleCardProposingForm(value)),
		onClearProposeCardError: () => dispatch(actions.clearProposeCardError())
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Cards));
