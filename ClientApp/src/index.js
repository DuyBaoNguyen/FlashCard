import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import thunk  from 'redux-thunk';
import * as reducers from './store/reducers';

import App from './App';

import history from './history';
//import registerServiceWorker from './registerServiceWorker';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const rootReducer = combineReducers({
	home: reducers.homeReducer,
});
const store = createStore(rootReducer, applyMiddleware(thunk));
const app = (
	<Provider store={store}>
		<Router basename={baseUrl} history={history}>
			<App />
		</Router>
	</Provider>
);

ReactDOM.render(app, rootElement);

// Uncomment the line above that imports the registerServiceWorker function
// and the line below to register the generated service worker.
// By default create-react-app includes a service worker to improve the
// performance of the application by caching static assets. This service
// worker can interfere with the Identity UI, so it is
// disabled by default when Identity is being used.
//
//registerServiceWorker();
