import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import UsersTable from './UsersTable/UsersTable';
import UserInfo from './UserInfo/UserInfo';

import './UsersManagement.css';

class UsersManagement extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
		};
	}
	componentWillMount() {
		this.props.onGetUsers();
	}

	render() {
		return (
			<div className="users-wrapper">
				<UsersTable />
				{this.props.currentUser !== null ? (
					<UserInfo />
				) : (
					<div className="users-blank">
						<p>Select user to view information</p>
					</div>
				)}
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
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(UsersManagement));
