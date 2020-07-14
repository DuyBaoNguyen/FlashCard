import React, { Component } from 'react';
import { connect } from 'react-redux';

import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import UsersTable from './UsersTable/UsersTable';
import UserInfo from './UserInfo/UserInfo';
import CardInfo from '../../../components/User/CardInfo/CardInfo';
import './UsersManagement.css';

class UsersManagement extends Component {
	componentDidMount() {
		this.props.onGetUsers();
	}

	componentWillUnmount() {
		this.props.onUnselectCard();
	}

	handleCloseCard = () => {
		this.props.onUnselectCard();
	}

	render() {
		const { currentUser, selectedCard } = this.props;

		return (
			<div className="users-wrapper">
				<section className="left-section">
					{selectedCard
						? (
							<CardInfo card={selectedCard} closed={this.handleCloseCard} />
						)
						: (
							<UsersTable />
						)
					}
				</section>
				<section className="right-section">
					{currentUser !== null
						? (
							<UserInfo />
						)
						: (
							<div className="users-blank">
								<p>Select user to view information</p>
							</div>
						)
					}
				</section>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		usersList: state.usersmanagement.usersList,
		currentUser: state.usersmanagement.currentUser,
		selectedCard: state.usersmanagement.selectedCard
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetUsers: () => dispatch(actions.getUsers()),
		onUnselectCard: () => dispatch(actions.unselectUserCard())
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(UsersManagement));
