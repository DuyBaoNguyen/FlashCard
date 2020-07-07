import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler';
import * as actions from '../../../../store/actions/index';
import Pagination from 'react-js-pagination';

import './UsersTable.css';

class UsersTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
			userId: null,
		};
	}

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	onClickUser = (id) => {
		this.props.onSetCurrentUser(id);
	};

	render() {
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
				<tr onClick={() => this.onClickUser(user.id)}>
					<td className="users-table-width-small">{index + 1}</td>
					<td className="users-table-width-medium">{user.name}</td>
					<td className="users-table-width-large">{user.email}</td>
				</tr>
			);
		});

		return (
			<div className="users-table-wrapper">
				<div className="users-table-title">Users Management</div>
				<div className="users-table">
					<table>
						<tr className="users-table-header">
							<th className="users-table-width-small first-cell">No.</th>
							<th className="users-table-width-medium">Name</th>
							<th className="users-table-width-large last-cell">Email</th>
						</tr>
						{users}
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
		currentUser: state.usersmanagement.currentUser,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetUsers: () => dispatch(actions.getUsers()),
		onSetCurrentUser: (id) => dispatch(actions.setCurrentUser(id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(UsersTable));