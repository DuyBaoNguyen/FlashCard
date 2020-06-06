import React, { Component } from 'react';
import { Switch, withRouter } from 'react-router-dom';
import { Route } from 'react-router';
import Layout from './components/Shared/Layout/Layout';
import { connect } from 'react-redux';

import Home from './containers/User/Home/Home';
import CreateDeck from './containers/User/CreateDeck/CreateDeck';
import EditDeck from './containers/User/EditDeck/EditDeck';
import Testing from './containers/User/Testing/Testing';
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
					<AuthorizeRoute exact path="/editDeck/" component={EditDeck} />
					<AuthorizeRoute exact path="/testing/" component={Testing} />
					<AuthorizeRoute path="/decks/:deckId" component={DeckDetail} />

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