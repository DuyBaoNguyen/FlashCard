import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router';
import Layout from './components/Shared/Layout/Layout';

import Home from './containers/User/Home/Home';
import CreateDeck from './containers/User/CreateDeck/CreateDeck';

import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css';

export default class App extends Component {
	static displayName = App.name;

	render() {
		return (
			<Layout>
				<Switch>
					<AuthorizeRoute exact path="/" component={Home} />
					<AuthorizeRoute exact path="/createDeck" component={CreateDeck} />

					<Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
				</Switch>
			</Layout>
		);
	}
}
