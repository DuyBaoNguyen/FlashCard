import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './AdminDashboard.css';
import Navbar from '../../modules/NavBar/Navbar';
import AdminUsers from '../AdminUsers/AdminUsers';

class AdminDashboard extends Component {
	render() {
		return (
			<div>
				<Navbar navTitle="Admin Dashboard" />

				<div className="admin">
					<div className="admin-sidebar">
						<ul>
							<li>
								<Link to="/admindashboard">Users</Link>
							</li>
							<li>
								<Link to="/bubblegum">Bubblegum</Link>
							</li>
						</ul>
					</div>

					<div className="admin-manager">
						<Router>
							<Switch>
								<Route exact path="/admindashboard">
									<AdminUsers></AdminUsers>
								</Route>
								<Route path="/bubblegum">haha</Route>
							</Switch>
						</Router>
					</div>
				</div>
			</div>
		);
	}
}

export default AdminDashboard;
