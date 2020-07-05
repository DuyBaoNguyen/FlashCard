import React, { Component } from 'react';
import { connect } from 'react-redux';

import './UsersTable.css';

class UsersTable extends Component {
	componentWillUnmount() {}

	render() {
		return (
			<div className="users-table-wrapper">
				<div className="users-table-title">Users</div>
				<div className="users-table">
					<table>
						<tr className='users-table-header'>
							<th className="users-table-width-small first-cell">No.</th>
							<th className="users-table-width-medium">Name</th>
							<th className="users-table-width-large last-cell">Email</th>
						</tr>
						<tr>
							<td className="users-table-width-small">1</td>
							<td className="users-table-width-medium">Lam Nguyen</td>
							<td className="users-table-width-large">sample@user.com</td>
						</tr>
						<tr>
							<td className="users-table-width-small">1</td>
							<td className="users-table-width-medium">Lam Nguyen</td>
							<td className="users-table-width-large">sample@user.com</td>
						</tr>
					</table>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default UsersTable;
