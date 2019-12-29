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
import EditDeck from './components/Users/EditDeck/EditDeck';
import CreateCard from './components/Users/CreateCard/CreateCard';
import EditCard from './components/Users/EditCard/EditCard';
import PublicCard from './components/Users/PublicCard/PublicCard';
import PublicDecks from './components/Users/PublicDecks/PublicDecks';
import PublicDeckDetail from './components/Users/PublicDeckDetail/PublicDeckDetail';
import ProposeCardForDeck from './components/Users/ProposeCardForDeck/ProposeCardForDeck';
import ProposeDeck from './components/Users/ProposeDeck/ProposeDeck';

import AdminUsers from './components/Admin/AdminUsers/AdminUsers';
import ProposeCard from './components/Users/ProposeCard/ProposeCard';
import AdminPropose from './components/Admin/AdminPropose/AdminPropose';
import AdminProposeDeckDetail from './components/Admin/AdminProposeDeckDetail/AdminProposeDeckDetail';


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
					<AuthorizeRoute exact path="/editdeck/:deckId" component={EditDeck} />
					<AuthorizeRoute exact path="/createcard" component={CreateCard} />
					<AuthorizeRoute exact path="/editcard/:front" component={EditCard} />
					<AuthorizeRoute exact path='/cards' component={CardManagement} />
					<AuthorizeRoute exact path='/publiccards' component={PublicCard} />
					<AuthorizeRoute exact path='/proposecard' component={ProposeCard} />
					<AuthorizeRoute exact path='/publicdecks' component={PublicDecks} />
					<AuthorizeRoute exact path='/publicdecks/:deckId' component={PublicDeckDetail} />
					<AuthorizeRoute exact path='/proposal/:deckId' component={ProposeCardForDeck} />
					<AuthorizeRoute exact path='/proposedeck' component={ProposeDeck} />


					{/* Admin */}
					<AuthorizeRoute exact path='/users' component={AdminUsers} />
					<AuthorizeRoute exact path='/admin/propose' component={AdminPropose} />
					<AuthorizeRoute exact path='/admin/propose/:deckId' component={AdminProposeDeckDetail} />


					<Route
						path={ApplicationPaths.ApiAuthorizationPrefix}
						component={ApiAuthorizationRoutes}
					/>
				</Switch>
			</Layout>
		);
	}
}
