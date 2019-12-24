import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';

import './Dashboard.css';
import Navbar from '../../modules/NavBar/Navbar';
import Info from '../../modules/Info/Info';
import History from '../../modules/History/History';
import DeckList from '../../modules/DeckList/DeckList';

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			statisticsData: {},
			currentUser: {},
			history: []
		};
	}

	componentDidMount() {
		this.getStatistics();
		this.getCurrentUser();
		this.getHistory();
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

	getHistory = async () => {
		var url = '/api/history';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		if (response.status === 200) {
			const data = await response.json();
			this.setState({ history: data, loading: false });
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
		let history;
		const userRole = this.state.currentUser.role;
		if (userRole != undefined && userRole === 'user') {
			info = <Info data={this.state.statisticsData != undefined ? this.state.statisticsData : null} />;
			history = <History data={this.state.history != undefined ? this.state.history : null} />;
		}

		return (
			<div>
				<div className="dashboard-field">
					<div className="dashboard-container">
						{info}
						{history}
					</div>
					<DeckList menuName="Your decks" addButton="true" />
				</div>
			</div>
		);
	}
}

export default Dashboard;
