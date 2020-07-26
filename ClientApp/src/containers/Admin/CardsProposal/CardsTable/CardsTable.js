import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler';
import * as actions from '../../../../store/actions/index';
import Pagination from 'react-js-pagination';

import './CardsTable.css';

class CardsTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	onClickCard = (cardId) => {
		this.props.onSelectCard(cardId);
		this.props.onGetCurrentProposalCard(cardId);
		this.props.onGetCard(cardId);
	};

	render() {
		const { selectedCard, cardsProposalList } = this.props;
		let cards, pagination;

		if (cardsProposalList.length > 0) {
			pagination = (
				<Pagination
					hideFirstLastPages
					prevPageText="<"
					nextPageText=">"
					activePage={this.state.activePage}
					itemsCountPerPage={10}
					totalItemsCount={
						this.props.cardsProposalList !== null
							? this.props.cardsProposalList.length
							: null
					}
					pageRangeDisplayed={5}
					onChange={this.handlePageChange.bind(this)}
					activeClass="pagination-item-active"
					itemClass="pagination-item"
				/>
			);

			cards = this.props.cardsProposalList.map((card, index) => {
				return (
					<tr
						key={card.id}
						className={card.id === selectedCard?.id ? 'active' : null}
						onClick={() => this.onClickCard(card.id)}
					>
						<td className="users-table-width-small">{index + 1}</td>
						<td className="users-table-width-large">{card.front}</td>
					</tr>
				);
			});
		}
		return (
			<div className="users-table-wrapper">
				<div className="users-table-title">Cards Proposal</div>
				<div className="users-table">
					{cards
						? (
							<table>
								<thead>
									<tr className="users-table-header">
										<th className="users-table-width-small first-cell">No.</th>
										<th className="users-table-width-large last-cell">Front</th>
									</tr>
								</thead>
								<tbody>{cards}</tbody>
							</table>
						)
						: (
							<p className="text-notify">There are no cards here!</p>
						)
					}
				</div>
				<div className="users-table-pagination">{pagination}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		card: state.card.card,
		currentProposalCard: state.cardsProposal.currentProposalCard,
		selectedCard: state.cardsProposal.selectedCard
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetUsers: () => dispatch(actions.getUsers()),
		onGetCard: (cardId) => dispatch(actions.getCard(cardId)),
		onGetCurrentProposalCard: (cardId) => dispatch(actions.getCurrentProposalCard(cardId)),
		onSelectCard: (cardId) => dispatch(actions.selectProposedCard(cardId))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(CardsTable));
