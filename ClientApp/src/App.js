import React, { Component } from 'react';
import { Switch, withRouter } from 'react-router-dom';
import { Route } from 'react-router';
import Layout from './components/Shared/Layout/Layout';
import { connect } from 'react-redux';

import Home from './containers/User/Home/Home';
import CreateDeck from './containers/User/CreateDeck/CreateDeck';
import EditDeck from './containers/User/EditDeck/EditDeck';
import Testing from './containers/User/Testing/Testing';
import MatchCard from './containers/User/MatchCard/MatchCard';

import DeckDetail from './containers/User/DeckDetail/DeckDetail';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import * as actions from './store/actions';
import './custom.css';

class App extends Component {
	componentDidMount() {
		this.props.onGetProfile();
	}

	render() {
		return (
			<Layout>
				<Switch>
					<AuthorizeRoute exact path="/" component={Home} />
					<AuthorizeRoute exact path="/createDeck" component={CreateDeck} />
					<AuthorizeRoute exact path="/decks/:deckId/edit/" component={EditDeck} />
					<AuthorizeRoute exact path="/decks/testing/:deckId/"  component={Testing} />
					<AuthorizeRoute exact path="/decks/match/:deckId/"  component={MatchCard} />
					<AuthorizeRoute exact path="/decks/:deckId" component={DeckDetail} />

					<Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
				</Switch>
			</Layout>
		);
	}
}

const mapStateToProps = state => {
	return {
		profile: state.home.profile
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onGetProfile: () => dispatch(actions.getProfile())
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));