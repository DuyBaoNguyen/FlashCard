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

import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css';
import Dashboard from './components/Users/Dashboard/Dashboard';
import DeckDetail from './components/Users/DeckDetail/DeckDetail';
import Testing from './components/Users/Testing/Testing';
import CardManagement from './components/Users/CardManagement/CardManagement';
import AddCards from './components/Users/AddCards/AddCards';
import CreateDeck from './components/Users/CreateDeck/CreateDeck';
import CreateCard from './components/Users/CreateCard/CreateCard';
import EditCard from './components/Users/EditCard/EditCard';




export default class App extends Component {
	static displayName = App.name;

	render() {
		return (
			<Layout>
				<Switch>
					<AuthorizeRoute exact path="/" component={Dashboard} />
					<AuthorizeRoute exact path="/decks/:deckId" component={DeckDetail} />
					<AuthorizeRoute exact path="/testing/:deckId" component={Testing} />
					<AuthorizeRoute exact path="/addcards/:deckId" component={AddCards} />
					<AuthorizeRoute exact path="/createdeck" component={CreateDeck} />
					<AuthorizeRoute exact path="/createcard" component={CreateCard} />
					<AuthorizeRoute exact path="/editcard/:front" component={EditCard} />
					<AuthorizeRoute exact path='/cards' component={CardManagement} />
					<Route
						path={ApplicationPaths.ApiAuthorizationPrefix}
						component={ApiAuthorizationRoutes}
					/>
				</Switch>
			</Layout>
		);
	}
}
