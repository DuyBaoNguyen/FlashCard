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

	onClickDeleteUser = (param) => {
		// this.props.onDeleteCurrentUser(param);
	};

	render() {
		return (
			<div className="profile-wrapper">
				<div className="profile-info-panel">
					{/* <div className="profile-info">
						<div className="profile-info-title">ID</div>
						<div className="profile-info-content">
							{this.props.currentUser.id}
						</div>
					</div> */}
					<div className="profile-info">
						<div className="profile-info-title">Name</div>
						<div className="profile-info-content">
							{this.props.currentUser.name}
						</div>
					</div>
					<div className="profile-info">
						<div className="profile-info-title">Email</div>
						<div className="profile-info-content">
							{this.props.currentUser.email}
						</div>
					</div>

					<div className="profile-button">
						<Button
							className="profile-button-delete"
							onClick={() => this.onClickDeleteUser(this.props.currentUserId)}
						>
							Delete this user
						</Button>
					</div>
				</div>
				<div className="profile-avatar">
					{this.props.currentUser.pictureUrl
						? (
							<img src={this.props.currentUser.pictureUrl} alt="picture" width="107" height="104" />
						)
						: (
							<div className="fake-picture">
								{this.props.currentUser.name.substr(0, 1)}
							</div>
						)
					}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		currentUserId: state.usersmanagement.currentUserId,
		currentUser: state.usersmanagement.currentUser,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onDeleteCurrentUser: (currentUserId) => dispatch(actions.deleteCurrentUser(currentUserId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Profile));
