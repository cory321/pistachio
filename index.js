import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import App from './components/App';
import { change as hashChange } from './actions/route';
import * as reducers from './reducers';
import { applyMiddleware } from 'redux';

function createReducer( reducers ) {
	return combineReducers( reducers );
}

const reducer = createReducer( reducers );
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore( reducer, composeEnhancers( applyMiddleware( thunk ) ) );

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
