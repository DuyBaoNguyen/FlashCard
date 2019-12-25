import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';

// import './Dashboard.css';
// import Navbar from '../../modules/NavBar/Navbar';
// import Info from '../../modules/Info/Info';
// import History from '../../modules/History/History';
import PublicDeckList from '../../modules/PublicDeckList/PublicDeckList';

class Dashboard extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		return (
			<div>
				<div className="dashboard-field">
					<div className="dashboard-container">
						{/* {info}
						{history} */}
					</div>
					<PublicDeckList menuName="Public decks" addButton="true" />
				</div>
			</div>
		);
	}
}

export default Dashboard;
