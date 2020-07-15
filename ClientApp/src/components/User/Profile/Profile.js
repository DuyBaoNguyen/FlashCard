import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions';
import NameUpdatingForm from '../NameUpdatingForm/NameUpdatingForm';
import './Profile.css';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.uploadImageInput = React.createRef();
	}

	handleClickName = () => {
		this.props.onToggleNameUpdatingForm(true);
	};

	handleUploadImage = () => {
		this.uploadImageInput.current.click();
	};

	handleImageChange = (event) => {
		if (event.target.files.length > 0) {
			this.props.onUpdatePicture(event.target.files[0]);
			event.target.value = null;
		}
	};

	handleCloseNameUpdatingForm = () => {
		this.props.onToggleNameUpdatingForm(false);
	}

	render() {
		const { profile, nameUpdatingFormOpened } = this.props;

		return (
			<div className="home-profile-wrapper">
				<div
					className="home-profile-picture"
					onClick={this.handleUploadImage}>
					{profile?.pictureUrl
						? (
							<img src={profile.pictureUrl} alt="user_picture" width="88" height="88" />
						)
						: (
							<div className="fake-picture">
								{profile?.displayName.substr(0, 1)}
							</div>
						)
					}
					<input
						type="file"
						id="upload-image-input"
						ref={this.uploadImageInput}
						onChange={this.handleImageChange} />
				</div>
				<div className="home-profile-info">
					<div
						className="home-profile-info-name"
						onClick={this.handleClickName}>
						{profile?.displayName}
					</div>
					<div className="home-profile-info-email">
						{profile?.email}
					</div>
				</div>
				<NameUpdatingForm
					profile={profile}
					isOpen={nameUpdatingFormOpened}
					onClose={this.handleCloseNameUpdatingForm} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		profile: state.home.profile,
		nameUpdatingFormOpened: state.home.nameUpdatingFormOpened
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onUpdateName: (displayName) => dispatch(actions.updateCurrentUserName(displayName)),
		onUpdatePicture: (picture) => dispatch(actions.updateCurrentUserPicture(picture)),
		onToggleNameUpdatingForm: (value) => dispatch(actions.toggleNameUpdatingForm(value))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
