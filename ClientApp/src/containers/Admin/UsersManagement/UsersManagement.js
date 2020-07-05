import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import UsersTable from './UsersTable/UsersTable';
import './UsersManagement.css';

class UsersManagement extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
		};
	}
	componentWillUnmount() {
		this.onGetUsers();
	}

	render() {
		return (
			<div className="users-wrapper">
				<UsersTable users={this.props.userList} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		usersList: state.usersmanagement.usersList,
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
