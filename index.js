import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import { register, createReduxStore } from '@wordpress/data';
import { pistachioConfig } from './data';
import { PISTACHIO_STORE } from './data/constants';
import thunk from 'redux-thunk';

import App from './components/App';
import { change as hashChange } from './actions/route';
import * as reducers from './reducers';

function createReducer( reducers ) {
	return combineReducers( reducers );
}

const reducerRedux = createReducer( reducers );
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore( reducerRedux, composeEnhancers( applyMiddleware( thunk ) ) );

const pistachioStore = createReduxStore( PISTACHIO_STORE, pistachioConfig );
register( pistachioStore );

function route() {
	store.dispatch( hashChange( window.location.hash.slice( 1 ) ) );
}

window.addEventListener( 'hashchange', route );
route();

ReactDOM.render(
	<Provider store={ store }>
		<App />
	</Provider>,
	document.getElementById( 'pistachio' )
);
