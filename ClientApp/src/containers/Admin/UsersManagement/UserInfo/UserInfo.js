import React, { Component } from 'react';

import Profile from '../../../../components/Admin/Profile/Profile';
import UserDecks from '../../../../components/Admin/UserDecks/UserDecks';
import UserCards from '../../../../components/Admin/UserCards/UserCards';

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

	userTabs = () => {
		if (this.state.activePage === 1) {
			return <Profile />;
		}
		if (this.state.activePage === 2) {
			return <UserDecks />;
		}
		if (this.state.activePage === 3) {
			return <UserCards />;
		}
	};

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	render() {
		let activePage = this.userTabs();
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
					{activePage}
				</div>
			</div>
		);
	}
}

export default UserInfo;
