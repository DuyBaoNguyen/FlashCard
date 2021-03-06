import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler';
import * as actions from '../../../../store/actions/index';
import Pagination from 'react-js-pagination';
import Search from '../../../../components/Shared/Search/Search';
import './UsersTable.css';

class UsersTable extends Component {
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
		this.props.onGetCurrentUserStatistics(userId);
		this.props.onGetCurrentUserDecks(userId);
		this.props.onGetCurrentUserCards(userId);
	};

	handleSearchUsers = (event) => {
		this.props.onUpdateUserSearchString(event.target.value);
		this.props.onGetUsers();
	}

	render() {
		const { currentUserId, searchString } = this.props;
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
					<td className="users-table-width-large">{user.email}</td>
				</tr>
			);
		});

		return (
			<div className="users-table-wrapper">
				<div className="users-table-title">
					Users
					<Search
						placeholder="Search..."
						value={searchString}
						onChange={this.handleSearchUsers} />
				</div>
				<div className="users-table">
					<table>
						<thead>
							<tr className="users-table-header">
								<th className="users-table-width-small first-cell">No.</th>
								<th className="users-table-width-medium">Name</th>
								<th className="users-table-width-large last-cell">Email</th>
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
		searchString: state.usersmanagement.searchString
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetUsers: () => dispatch(actions.getUsers()),
		onSetCurrentUserId: (id) => dispatch(actions.setCurrentUserId(id)),
		onGetCurrentUser: (userId) => dispatch(actions.getCurrentUser(userId)),
		onGetCurrentUserDecks: (userId) => dispatch(actions.getCurrentUserDecks(userId)),
		onGetCurrentUserCards: (userId) => dispatch(actions.getCurrentUserCards(userId)),
		onGetCurrentUserStatistics: (userId) => dispatch(actions.getCurrentUserStatistics(userId)),
		onUpdateUserSearchString: (value) => dispatch(actions.updateUserSearchString(value))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(UsersTable));
