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
		this.props.onGetCurrentProposalCard(cardId);
		this.props.onGetCard(cardId);
	};

	render() {
		const { currentUserId } = this.props;
		let pagination = (
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

		let cards = this.props.cardsProposalList.map((card, index) => {
			return (
				<tr
					key={card.id}
					className={card.id === currentUserId ? 'active' : null}
					onClick={() => this.onClickCard(card.id)}
				>
					<td className="users-table-width-small">{index + 1}</td>
					<td className="users-table-width-medium">{card.front}</td>
					<td className="users-table-width-large">
						{card.backs[0].author.email}
					</td>
				</tr>
			);
		});
		return (
			<div className="users-table-wrapper">
				<div className="users-table-title">Cards Proposal</div>
				<div className="users-table">
					<table>
						<thead>
							<tr className="users-table-header">
								<th className="users-table-width-small first-cell">No.</th>
								<th className="users-table-width-medium">Front</th>
								<th className="users-table-width-large last-cell">Author</th>
							</tr>
						</thead>
						<tbody>{cards}</tbody>
					</table>
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
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetUsers: () => dispatch(actions.getUsers()),
		onGetCard: (cardId) => dispatch(actions.getCard(cardId)),
		onGetCurrentProposalCard: (cardId) =>
			dispatch(actions.getCurrentProposalCard(cardId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(CardsTable));
