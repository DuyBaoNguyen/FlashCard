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
			statisticsData: {}
		};
	}
	
	componentDidMount() {
		this.getStatistics();
	}

	getStatistics = async () => {
		var url = '/api/statistics';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({ statisticsData: data, loading: false });
		console.log(data);
	};

	render() {
		return (
			<div>
				<div className="dashboard-field">
					<Info
						data={
							this.state.statisticsData != undefined
								? this.state.statisticsData
								: null
						}
					/>

					<DeckList menuName="Your decks" addButton="true" />
				</div>
			</div>
		);
	}
}

export default Dashboard;
