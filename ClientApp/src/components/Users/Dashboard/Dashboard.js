import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';

import './Dashboard.css';
import Navbar from '../../modules/NavBar/Navbar';
import Info from '../../modules/Info/Info';
import DeckList from '../../modules/DeckList/DeckList';

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			statisticsData: {},
			currentUser: {}
		};
	}

	componentDidMount() {
		this.getStatistics();
		this.getCurrentUser();
	}

	getStatistics = async () => {
		var url = '/api/statistics';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		if (response.status === 200) {
			const data = await response.json();
			this.setState({ statisticsData: data, loading: false });
		}
	};

	getCurrentUser = async () => {
		const token = await authService.getAccessToken();
		const response = await fetch('/api/currentuser', {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		if (response.status === 200) {
			this.setState({ currentUser: await response.json() })
		}
	}

	render() {
		let info;
		const userRole = this.state.currentUser.role;
		if (userRole != undefined && userRole === 'user') {
			info = <Info data={this.state.statisticsData != undefined ? this.state.statisticsData : null} />
		}

		return (
			<div>
				<div className="dashboard-field">
					{info}

					<DeckList menuName="Your decks" addButton="true" />
				</div>
			</div>
		);
	}
}

export default Dashboard;
