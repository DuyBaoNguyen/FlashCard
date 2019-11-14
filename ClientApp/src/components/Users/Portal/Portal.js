import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Link,
	Redirect,
	withRouter
} from 'react-router-dom';

import './Portal.css';

import Feature from '../../modules/Feature/Feature';
import Dashboard from '../Dashboard/Dashboard';

class Portal extends Component {
	render() {
		return (
				<div class="portal">
					<div class="portal-content">
						<div class="portal-content-title">
							<p>Select features:</p>
						</div>
						<div>
							<br></br>
						</div>
						<Link to="/dashboard">
							<Feature />
						</Link>
					</div>
				</div>
		);
	}
}

export default Portal;
