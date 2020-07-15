import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import deleteIcon from '@iconify/icons-uil/trash-alt';

import withErrorHandler from '../../../hoc/withErrorHandler';
import Button from '../../Shared/Button/Button';
import Confirm from '../../Shared/Confirm/Confirm';
import * as actions from '../../../store/actions/index';
import './Profile.css';

class Profile extends Component {
	state = {
		deletingConfirmOpen: false
	};

	handleDeleteCurrentUser = () => {
		const { onDeleteCurrentUser, currentUserId } = this.props;
		onDeleteCurrentUser(currentUserId);
		this.setState({ deletingConfirmOpen: false });
	};

	handleOpenDeletingConfirm = () => {
		this.setState({ deletingConfirmOpen: true });
	}

	handleCloseDeletingConfirm = () => {
		this.setState({ deletingConfirmOpen: false });
	}

	render() {
		const { currentUser } = this.props;
		const { deletingConfirmOpen } = this.state;

		return (
			<div className="profile-wrapper">
				<div className="profile-info-panel">
					<div className="profile-info">
						<div className="profile-info-title">Name</div>
						<div className="profile-info-content">
							{currentUser.name}
						</div>
					</div>
					<div className="profile-info">
						<div className="profile-info-title">Email</div>
						<div className="profile-info-content">
							{currentUser.email}
						</div>
					</div>

					<div className="profile-button">
						<Button
							className="profile-button-delete"
							icon={<Icon icon={deleteIcon} />}
							onClick={this.handleOpenDeletingConfirm}>
							Delete this user
						</Button>
					</div>
				</div>
				<div className="profile-picture">
					<div className="picture-wrapper">
						{currentUser.pictureUrl
							? (
								<img src={currentUser.pictureUrl} alt="user_picture" width="99" height="99" />
							)
							: (
								<div className="fake-picture">
									{currentUser.name.substr(0, 1)}
								</div>
							)
						}
					</div>
				</div>
				<Confirm
					isOpen={deletingConfirmOpen}
					header="Delete"
					message="Are you sure you want to delete this user?"
					confirmColor="#fe656d"
					onCancel={this.handleCloseDeletingConfirm}
					onConfirm={this.handleDeleteCurrentUser}>
				</Confirm>
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
		onDeleteCurrentUser: (userId) => dispatch(actions.deleteCurrentUser(userId)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Profile));
