import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../../hoc/withErrorHandler';
import * as actions from '../../../../../store/actions/index';
import Button from '../../../../../components/Shared/Button/Button';
import './Profile.css';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	// componentDidMount() {
	// 	this.props.onGetCurrentUser(this.props.currentUser);
	// }

	onClickDeleteUser = (param) => {
		this.props.onDeleteCurrentUser(param);
	};
	
	render() {
		return (
			<div className="profile-wrapper">
				<div className="profile-info-panel">
					<div className="profile-info">
						<div className="profile-info-title">ID</div>
						<div className="profile-info-content">
							{this.props.currentUserData?.id}
						</div>
					</div>
					<div className="profile-info">
						<div className="profile-info-title">Name</div>
						<div className="profile-info-content">
							{this.props.currentUserData?.name}
						</div>
					</div>
					<div className="profile-info">
						<div className="profile-info-title">Email</div>
						<div className="profile-info-content">
							{this.props.currentUserData?.email}
						</div>
					</div>

					<div className="profile-button">
						<Button
							className="profile-button-delete"
							onClick={() => this.onClickDeleteUser(this.props.currentUser)}
						>
							Delete this user
						</Button>
					</div>
				</div>
				<div className="profile-avatar">Avatar here</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.usersmanagement.currentUser,
		currentUserData: state.usersmanagement.currentUserData,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onDeleteCurrentUser: (currentUser) =>
			dispatch(actions.deleteCurrentUser(currentUser)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Profile));
