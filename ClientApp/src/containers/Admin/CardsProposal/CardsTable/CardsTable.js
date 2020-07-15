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
			activePage: 1
		};
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	onClickUser = (userId) => {
		this.props.onSetCurrentUserId(userId);
		this.props.onGetCurrentUser(userId);
		this.props.onGetCurrenctUserDecks(userId);
		this.props.onGetCurrenctUserCards(userId);
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
					this.props.usersList !== null ? this.props.usersList.length : null
				}
				pageRangeDisplayed={5}
				onChange={this.handlePageChange.bind(this)}
				activeClass="pagination-item-active"
				itemClass="pagination-item"
			/>
		);

		let users = this.props.usersList.map((user, index) => {
			return (
				<tr 
					key={user.id} 
					className={user.id === currentUserId ? 'active' : null}
					onClick={() => this.onClickUser(user.id)}>
					<td className="users-table-width-small">{index + 1}</td>
					<td className="users-table-width-medium">{user.name}</td>
					<td className="users-table-width-large">	</td>
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
								<th className="users-table-width-medium">Author</th>
								<th className="users-table-width-large last-cell">Front</th>
							</tr>
						</thead>
						<tbody>
							{users}
						</tbody>
					</table>
				</div>
				<div className="users-table-pagination">{pagination}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		usersList: state.usersmanagement.usersList,
		currentUserId: state.usersmanagement.currentUserId,
		currentUser: state.usersmanagement.currentUser,
		currentUserData: state.usersmanagement.currentUserData,
		currentUserDecks: state.usersmanagement.currentUserDecks,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetUsers: () => dispatch(actions.getUsers()),
		onSetCurrentUserId: (id) => dispatch(actions.setCurrentUserId(id)),
		onGetCurrentUser: (userId) => dispatch(actions.getCurrentUser(userId)),
		onGetCurrenctUserDecks: (userId) => dispatch(actions.getCurrentUserDecks(userId)),
		onGetCurrenctUserCards: (userId) => dispatch(actions.getCurrentUserCards(userId))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(CardsTable));
