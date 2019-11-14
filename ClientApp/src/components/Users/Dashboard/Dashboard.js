import React, { Component } from 'react';

import './Dashboard.css';
import Navbar from '../../modules/NavBar/Navbar';
import Info from '../../modules/Info/Info';
import DeckList from '../../modules/DeckList/DeckList';

class Dashboard extends Component {
	render() {
		return (
			<div>
				<div className="dashboard-field">
				<Info />
				
				<DeckList menuName="Your decks" addButton="true"/>
				</div>
			</div>
		);
	}
}

export default Dashboard;
