import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler';
import * as actions from '../../../../store/actions/index';

import Profile from './Profile/Profile';
import './UserInfo.css';

class UserInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	onChangePage = (param) => {
		this.setState({
			activePage: param,
		});
	};

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	render() {
		return (
			<div className="user-info-wrapper">
				<ul className="user-info-menu">
					<li
						className={
							this.state.activePage === 1 ? 'user-info-page-active' : ''
						}
						onClick={() => this.onChangePage(1)}
					>
						Profile
					</li>
					<li
						className={
							this.state.activePage === 2 ? 'user-info-page-active' : ''
						}
						onClick={() => this.onChangePage(2)}
					>
						Decks
					</li>
					<li
						className={
							this.state.activePage === 3 ? 'user-info-page-active' : ''
						}
						onClick={() => this.onChangePage(3)}
					>
						Cards
					</li>
				</ul>
				<div className="user-panel">
					<Profile />
				</div>
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
)(withErrorHandler(UserInfo));
