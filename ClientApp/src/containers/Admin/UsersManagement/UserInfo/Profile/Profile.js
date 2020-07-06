import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../hoc/withErrorHandler';
import * as actions from '../../../../../store/actions/index';

import './Profile.css';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	render() {
		return (
			<div className="profile-wrapper">

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
)(withErrorHandler(Profile));
