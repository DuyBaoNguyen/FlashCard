import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Link,
	Redirect
} from 'react-router-dom';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';

import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css';
import Dashboard from './components/Users/Dashboard/Dashboard';
import DeckDetail from './components/Users/DeckDetail/DeckDetail';
import Testing from './components/Users/Testing/Testing';

export default class App extends Component {
	static displayName = App.name;

	render() {
		return (
			<Layout>
				<Switch>
					<AuthorizeRoute exact path="/" component={Dashboard} />
					<AuthorizeRoute exact path="/decks/:deckId" component={DeckDetail} />
					<AuthorizeRoute exact path="/testing/:deckId" component={Testing} />

					{/* <AuthorizeRoute exact path='/DB' component={CardManegement} /> */}
					<AuthorizeRoute path="/counter" component={Counter} />
					<AuthorizeRoute path="/fetch-data" component={FetchData} />
					<Route
						path={ApplicationPaths.ApiAuthorizationPrefix}
						component={ApiAuthorizationRoutes}
					/>
				</Switch>
			</Layout>
		);
	}
}
