import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import Button from '../../Shared/Button/Button';
import './Profile.css';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.uploadImageInput = React.createRef();

		this.state = {
			onEditName: false,
			displayName: this.props.profile?.displayName,
		};
	}

	onClickName = () => {
		this.setState({
			onEditName: !this.state.onEditName,
		});
	};

	handleUploadImage = () => {
		this.uploadImageInput.current.click();
	};

	handleImageChange = (event) => {
		if (event.target.files.length > 0) {
			const { onUpdateAvatar } = this.props;
			onUpdateAvatar(event.target.files[0]);
			event.target.value = null;
		}
	};

	handleSubmit = (event) => {
		// event.preventDefault();
		this.props.onUpdateName(this.state.displayName);
	};

	handleInputChange = (event) => {
		let target = event.target;
		let name = target.name;
		let value = target.value;
		this.setState({
			[name]: value,
		});
	};

	render() {
		let displayInfo = (
			<div className="home-profile-info">
				<div
					className="home-profile-info-name"
					onClick={() => this.onClickName()}
				>
					{this.props.profile?.displayName}
				</div>
				<div className="home-profile-info-email">
					{this.props.profile?.email}
				</div>
			</div>
		);
		let displayEditName = (
			<div className="">
				<form onSubmit={this.handleSubmit}>
					<div className="deck-form-input">
						<label>Name</label>
						<input
							type="text"
							name="displayName"
							checked
							defaultValue={this.props.profile?.displayName}
							autoComplete="off"
							onChange={(e) => this.handleInputChange(e)}
						/>
					</div>

					<div className="deck-form-button">
						<Button
							className="deck-form-button-cancel"
							onClick={() => this.onClickName()}
						>
							Cancel
						</Button>
						<Button
							className="deck-form-button-create"
							type="submit"
							value="Submit"
						>
							Save
						</Button>
					</div>
				</form>
			</div>
		);
		return (
			<div className="home-profile-wrapper">
				<div
					className="home-profile-avatar"
					onClick={() => this.handleUploadImage()}
				>
					{' '}
					<input
						type="file"
						id="upload-image-input"
						ref={this.uploadImageInput}
						onChange={this.handleImageChange}
					/>
				</div>
				{this.state.onEditName ? displayEditName : displayInfo}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { profile: state.home.profile };
};

const mapDispatchToProps = (dispatch) => {
	return {
		onUpdateName: (displayName) => dispatch(actions.updateName(displayName)),
		onUpdateAvatar: (pictureUrl) => dispatch(actions.updateName(pictureUrl)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
